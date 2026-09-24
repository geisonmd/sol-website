import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

export const Ciudades: CollectionConfig = {
  slug: 'ciudades',
  admin: {
    useAsTitle: 'name',
    group: 'Cobertura',
    defaultColumns: ['name', 'departamento'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'departamento',
      type: 'relationship',
      relationTo: 'departamentos',
      required: true,
      index: true,
    },
    slugField('name'),
  ],
}
