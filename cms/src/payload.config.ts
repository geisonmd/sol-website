import { postgresAdapter } from '@payloadcms/db-postgres'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Categories } from './collections/Categories'
import { Ciudades } from './collections/Ciudades'
import { Departamentos } from './collections/Departamentos'
import { Depoimentos } from './collections/Depoimentos'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Planes } from './collections/Planes'
import { Posts } from './collections/Posts'
import { Tags } from './collections/Tags'
import { Users } from './collections/Users'
import { Vacantes } from './collections/Vacantes'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Pages,
    Posts,
    Categories,
    Tags,
    Planes,
    Departamentos,
    Ciudades,
    Vacantes,
    Depoimentos,
    Media,
    Users,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  cors: [process.env.FRONTEND_URL || 'http://localhost:4321'].filter(Boolean),
  csrf: [process.env.FRONTEND_URL || 'http://localhost:4321'].filter(Boolean),
  plugins: [
    seoPlugin({
      collections: ['posts', 'pages', 'vacantes'],
      uploadsCollection: 'media',
      tabbedUI: true,
    }),
  ],
})
