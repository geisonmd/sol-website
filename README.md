# sol-website

Reconstrução do site sol.com.py.

- **`cms/`** — backend headless em [Payload CMS](https://payloadcms.com) (Next.js + Postgres). Painel admin e API para o conteúdo do site. Veja [`cms/README.md`](./cms/README.md) para desenvolvimento e deploy no cPanel.
- **`web/`** — frontend em [Astro](https://astro.build) + Tailwind CSS (saída estática, com rebuild disparado por webhook do CMS), consumindo a API do `cms/`. Design de referência: Figma ("UI finished").

## Status

- [x] Payload CMS: collections (Pages, Posts, Categories, Tags, Planes, Departamentos, Ciudades, Vacantes, Depoimentos, Sucursales, Media, Users), Site Settings, SEO — configurado com Postgres, migrations testadas, build de produção validado, deploy em `cms.sol.com.py`.
- [x] Migração de conteúdo do WordPress: Departamentos/Ciudades, Planes, Sucursales, Vacantes, Depoimentos e Posts do blog.
- [ ] Migração de conteúdo do WordPress: Pages (adiado — conteúdo novo vem do redesign em Figma).
- [x] Frontend em Astro — todas as páginas do inventário do Figma construídas (Home, Planes, Trabaje con nosotros + vacantes, Quienes Somos, Contacto, Sol Play, Utilidades, Blog, Gracias, 404), menu mobile incluído.
- [x] Webhook de rebuild: hooks do Payload (`cms/src/lib/triggerRebuild.ts`) disparam um `repository_dispatch` no GitHub, pego pela Action em `.github/workflows/rebuild.yml`. Falta só configurar `GITHUB_DISPATCH_TOKEN` no CMS e os secrets de deploy (`DEPLOY_*` + variável `DEPLOY_ENABLED=true`) quando o deploy em produção acontecer.
- [ ] Buscador de planos conversacional com IA (Claude).
