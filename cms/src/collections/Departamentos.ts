import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

export const Departamentos: CollectionConfig = {
  slug: 'departamentos',
  admin: {
    useAsTitle: 'name',
    group: 'Cobertura',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    slugField('name'),
  ],
}
