# sol-website

Reconstrução do site sol.com.py.

- **`cms/`** — backend headless em [Payload CMS](https://payloadcms.com) (Next.js + Postgres). Painel admin e API para o conteúdo do site. Veja [`cms/README.md`](./cms/README.md) para desenvolvimento e deploy no cPanel.
- **`web/`** — frontend em [Astro](https://astro.build) + Tailwind CSS (saída estática, com rebuild disparado por webhook do CMS), consumindo a API do `cms/`. Design de referência: Figma ("UI finished").

## Status

- [x] Payload CMS: collections (Pages, Posts, Categories, Tags, Planes, Departamentos, Ciudades, Vacantes, Depoimentos, Sucursales, Media, Users), Site Settings, SEO — configurado com Postgres, migrations testadas, build de produção validado, deploy em `cms.sol.com.py`.
- [x] Migração de conteúdo do WordPress: Departamentos/Ciudades, Planes, Sucursales, Vacancias, Depoimentos e Posts do blog.
- [ ] Migração de conteúdo do WordPress: Pages (adiado — conteúdo novo vem do redesign em Figma).
- [ ] Frontend em Astro — scaffold criado e testado (build estático buscando dados do Payload), páginas sendo construídas a partir do Figma.
- [ ] Webhook de rebuild do Astro ao publicar conteúdo no Payload.
- [ ] Buscador de planos conversacional com IA (Claude).
