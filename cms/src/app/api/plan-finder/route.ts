import config from '@payload-config'
import { getPayload } from 'payload'

export const dynamic = 'force-dynamic'

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:4321'
const MODEL = 'claude-haiku-5-5'
const MAX_MESSAGES = 20
const MAX_MESSAGE_LENGTH = 1000

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': FRONTEND_URL,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() })
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

// Simple in-memory per-IP rate limit. Resets on process restart — fine for
// a single long-running Node process (cPanel's Node Selector), not meant to
// survive a horizontally-scaled deployment.
const RATE_LIMIT = 15
const RATE_WINDOW_MS = 60_000
const requestLog = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS)
  timestamps.push(now)
  requestLog.set(ip, timestamps)
  return timestamps.length > RATE_LIMIT
}

interface Plan {
  id: number
  title: string
  tipo: 'fibra' | 'xtreme'
  categoriaFibra?: string | null
  download: number
  upload: number
  priceUSD: number
  idealFor?: string[] | null
  firstMonthFree?: boolean | null
  zonaRural?: boolean | null
}

function buildSystemPrompt(planes: Plan[]): string {
  const catalog = planes
    .map((p) => {
      const bits = [
        p.title,
        p.tipo === 'fibra'
          ? `Fibra Óptica (${p.categoriaFibra ?? 'sin categoría'})`
          : 'Antena Xtreme',
        `${p.download}/${p.upload} Mbps`,
        `USD ${Number(p.priceUSD).toFixed(2)}/mes`,
        p.idealFor?.length ? `ideal para: ${p.idealFor.join(', ')}` : null,
        p.firstMonthFree ? 'primer mes gratis' : null,
        p.zonaRural ? 'disponible en zona rural' : null,
      ].filter(Boolean)
      return `- ${bits.join(' · ')}`
    })
    .join('\n')

  return `Eres el asistente de Sol Internet (proveedor de internet en Paraguay) encargado de ayudar a un visitante del sitio a encontrar el plan de internet ideal entre los planes reales que ofrece la empresa, listados abajo.

Catálogo actual de planes (siempre vigente, no inventes otros planes ni precios):
${catalog}

Instrucciones:
- Hacé 2 a 4 preguntas breves y concretas (una por mensaje) para entender la necesidad: para qué usa internet (navegar, trabajar/videollamadas, streaming, gaming, cámaras IP), cuántas personas/dispositivos, si es para casa o empresa, y si tiene fibra óptica disponible en su zona o necesita antena (si no lo sabe, asumí fibra y mencioná que un agente puede confirmar la cobertura exacta).
- No hagas más de una pregunta por turno. Sé breve, cálido y directo, en español paraguayo informal (vos, tenés).
- En cuanto tengas suficiente información, recomendá UN plan específico del catálogo (podés mencionar una segunda alternativa si hay ambigüedad real), explicando brevemente por qué encaja.
- Terminá el mensaje de recomendación con esta línea exacta al final, sin nada más después: [CTA:nombre-exacto-del-plan-como-aparece-arriba]
- No agregues la línea [CTA:...] en ningún otro mensaje que no sea una recomendación final.
- Si preguntan algo fuera de planes de internet (facturación, soporte técnico, trabajo, etc.), respondé en una frase y sugerí contactar por WhatsApp al +595 983 550 110 o visitar /contacto/.
- Nunca inventes precios, velocidades o planes que no estén en el catálogo de arriba.`
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: 'El buscador de planes no está configurado todavía.' },
      { status: 503, headers: corsHeaders() },
    )
  }

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (isRateLimited(ip)) {
    return Response.json(
      { error: 'Demasiados mensajes. Esperá un minuto y volvé a intentar.' },
      { status: 429, headers: corsHeaders() },
    )
  }

  let messages: ChatMessage[]
  try {
    const body = await req.json()
    messages = Array.isArray(body?.messages) ? body.messages : []
  } catch {
    return Response.json({ error: 'Solicitud inválida.' }, { status: 400, headers: corsHeaders() })
  }

  const isValid =
    messages.length > 0 &&
    messages.length <= MAX_MESSAGES &&
    messages.every(
      (m) =>
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.length > 0 &&
        m.content.length <= MAX_MESSAGE_LENGTH,
    )
  if (!isValid) {
    return Response.json({ error: 'Solicitud inválida.' }, { status: 400, headers: corsHeaders() })
  }

  const payload = await getPayload({ config })
  const { docs: planes } = await payload.find({
    collection: 'planes',
    limit: 100,
    depth: 0,
    sort: 'priceUSD',
  })

  const systemPrompt = buildSystemPrompt(planes as unknown as Plan[])

  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 512,
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    }),
  })

  if (!anthropicRes.ok) {
    console.error('[plan-finder] Anthropic API error:', anthropicRes.status, await anthropicRes.text())
    return Response.json(
      { error: 'No pudimos procesar tu mensaje. Intentá de nuevo en un momento.' },
      { status: 502, headers: corsHeaders() },
    )
  }

  const data = await anthropicRes.json()
  const reply = data.content?.find((c: { type: string }) => c.type === 'text')?.text ?? ''

  return Response.json({ reply }, { headers: corsHeaders() })
}
