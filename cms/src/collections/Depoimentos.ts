import type { CollectionConfig } from 'payload'

export const Depoimentos: CollectionConfig = {
  slug: 'depoimentos',
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'city', 'yearsAsClient'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'clientName',
      label: 'Nombre del cliente',
      type: 'text',
      required: true,
    },
    {
      name: 'city',
      label: 'Ciudad',
      type: 'relationship',
      relationTo: 'ciudades',
      required: true,
    },
    {
      name: 'yearsAsClient',
      label: 'Años de empresa (como cliente)',
      type: 'number',
    },
    {
      name: 'comment',
      label: 'Comentario',
      type: 'textarea',
      required: true,
    },
    {
      name: 'photo',
      label: 'Foto',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
