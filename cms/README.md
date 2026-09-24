# sol-cms — Payload CMS (backend headless para sol.com.py)

Backend de conteúdo em [Payload CMS 3](https://payloadcms.com) rodando sobre Next.js 16, com Postgres. Serve o painel admin (`/admin`) e a API REST/GraphQL que o frontend em Astro vai consumir depois.

## Collections

- **Pages** — páginas institucionais (slug, conteúdo rich text, imagem destacada, SEO), com rascunho/publicado.
- **Posts** — blog/notícias (título, slug, conteúdo, categorias, tags, autor, data de publicação, SEO), com rascunho/publicado.
- **Categories** / **Tags** — taxonomias, usadas por Posts.
- **Media** — uploads (imagens, com tamanhos automáticos thumbnail/card/og).
- **Users** — usuários do painel admin (roles: admin, editor).
- **Site Settings** (global) — nome do site, logo, contatos, redes sociais, navegação.

O plugin de SEO (`@payloadcms/plugin-seo`) adiciona campos de meta título/descrição/imagem em Pages e Posts.

## Desenvolvimento local

Requer Node 20.9+ e um Postgres acessível.

```bash
cp .env.example .env      # ajuste DATABASE_URL e PAYLOAD_SECRET
# opcional: subir um Postgres local via Docker
docker compose up -d

npm install
npm run dev                # http://localhost:3000/admin
```

Em modo dev, o Payload sincroniza o schema no Postgres automaticamente (push mode). Na primeira vez que abrir `/admin`, você vai criar o usuário admin inicial.

Gerar tipos TypeScript e o import map do admin sempre que mudar collections/campos:

```bash
npm run generate:types
npm run generate:importmap
```

## Migrations (obrigatório em produção)

Em produção (`NODE_ENV=production`), o push automático de schema fica **desligado** — é preciso aplicar migrations explicitamente. Isso evita alterações destrutivas acidentais num banco com dados reais.

```bash
npm run migrate:create -- --name nome_da_mudanca   # gera uma migration a partir do diff do config
npm run migrate                                     # aplica migrations pendentes
```

Sempre que adicionar/alterar uma collection ou campo, gere e commite a migration correspondente.

## Deploy no cPanel (Node.js Selector / Passenger)

Pré-requisitos no cPanel:
1. **Setup Node.js App** habilitado (CloudLinux). Versão do Node ≥ 20.9 (use a mais recente disponível).
2. Um banco **PostgreSQL** criado em "PostgreSQL Databases", com usuário e senha dedicados.

Passos:

1. **Criar a app Node.js no cPanel**
   - Application root: pasta onde o código vai ficar (ex: `sol-cms`), fora de `public_html` se possível, ou em `public_html/cms` se o painel exigir dentro dele.
   - Application URL: subdomínio/subpath dedicado ao CMS, ex: `cms.sol.com.py` (recomendado) ou `sol.com.py/cms`.
   - Application startup file: `server.js`.
   - Modo: Production.

2. **Definir as variáveis de ambiente** na tela da app Node.js do cPanel (equivalentes ao `.env.example`):
   - `DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco`
   - `PAYLOAD_SECRET=` (gere com `openssl rand -base64 32`, nunca reutilize a de dev)
   - `FRONTEND_URL=https://sol.com.py` (domínio real do Astro, para CORS/CSRF)
   - `NODE_ENV=production` (o cPanel geralmente já define isso)

3. **Build e deploy** (localmente, ou via terminal SSH do cPanel se disponível):
   ```bash
   npm ci
   npm run build
   npm run migrate       # aplica o schema no Postgres do cPanel
   ```
   Depois copie para o `Application root` do cPanel:
   - `.next/standalone/` (contém `server.js` + `node_modules` mínimos) → raiz da app
   - `.next/static/` → `.next/static/` dentro da app
   - `public/` → `public/` dentro da app (se existir)
   - o arquivo `.env` com as variáveis acima (ou configure só pela UI do cPanel)

   Alternativa: usar o terminal do próprio cPanel (se disponível) para rodar `npm ci && npm run build && npm run migrate` direto no `Application root`, depois apontar o "Application startup file" pro `server.js` gerado.

4. **Reiniciar a app** pela interface "Setup Node.js App" do cPanel (botão Restart) a cada novo deploy.

5. Acessar `https://cms.sol.com.py/admin` e criar o primeiro usuário admin.

### Notas importantes

- O Passenger injeta a porta via `process.env.PORT` — o `server.js` gerado pelo Next.js (standalone) já respeita isso, não precisa mexer.
- Uploads de mídia ficam em disco (`media/`, fora do build) por padrão — confirme que essa pasta tem persistência entre deploys no cPanel, ou migre para S3/object storage depois via `@payloadcms/storage-s3` se o plano de hosting não garantir isso.
- MySQL do cPanel **não** serve para o Payload — é necessário Postgres (o plano precisa oferecer "PostgreSQL Databases" no cPanel).

## Próximos passos

- Migração de conteúdo do WordPress (posts, páginas, mídia) para estas collections — aguardando acesso/exportação do WordPress atual.
- Frontend em Astro consumindo a API REST/GraphQL deste CMS (`web/`, a ser criado).
