# sol-website

Reconstrução do site sol.com.py.

- **`cms/`** — backend headless em [Payload CMS](https://payloadcms.com) (Next.js + Postgres). Painel admin e API para o conteúdo do site. Veja [`cms/README.md`](./cms/README.md) para desenvolvimento e deploy no cPanel.
- **`web/`** — frontend em Astro (a ser criado), consumindo a API do `cms/`.

## Status

- [x] Payload CMS: collections (Pages, Posts, Categories, Tags, Media, Users), Site Settings, SEO — configurado com Postgres, migrations testadas, build de produção validado.
- [ ] Migração de conteúdo do WordPress atual (aguardando export/credenciais).
- [ ] Frontend em Astro.
