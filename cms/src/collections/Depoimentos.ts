import type { CollectionConfig } from 'payload'

export const Depoimentos: CollectionConfig = {
  slug: 'depoimentos',
  admin: {
    useAsTitle: 'clientName',
    defaultColumns: ['clientName', 'city', 'companyArea'],
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
      type: 'text',
      required: true,
    },
    {
      name: 'companyArea',
      label: 'Área de empresa',
      type: 'text',
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
