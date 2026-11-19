const PAYLOAD_URL = import.meta.env.PAYLOAD_URL || 'https://cms.sol.com.py'

export async function fetchCollection<T>(
  collection: string,
  params: Record<string, string> = {},
): Promise<T[]> {
  const search = new URLSearchParams({ limit: '200', depth: '2', ...params })
  const res = await fetch(`${PAYLOAD_URL}/api/${collection}?${search}`)
  if (!res.ok) {
    throw new Error(`Failed to fetch ${collection}: ${res.status}`)
  }
  const json = await res.json()
  return json.docs as T[]
}

export async function fetchBySlug<T>(collection: string, slug: string): Promise<T | null> {
  const docs = await fetchCollection<T>(collection, {
    'where[slug][equals]': slug,
    limit: '1',
  })
  return docs[0] ?? null
}

export async function fetchGlobal<T>(slug: string): Promise<T> {
  const res = await fetch(`${PAYLOAD_URL}/api/globals/${slug}?depth=2`)
  if (!res.ok) {
    throw new Error(`Failed to fetch global ${slug}: ${res.status}`)
  }
  return res.json() as Promise<T>
}

export function mediaUrl(media: { url?: string | null } | number | null | undefined): string {
  if (!media || typeof media === 'number') return ''
  return media.url ? `${PAYLOAD_URL}${media.url}` : ''
}
