import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

export const Planes: CollectionConfig = {
  slug: 'planes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'tipo', 'categoriaFibra', 'download', 'upload', 'priceUSD'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      label: 'Nombre del plan',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'tipo',
      label: 'Tipo de internet',
      type: 'select',
      required: true,
      options: [
        { label: 'Fibra Óptica', value: 'fibra' },
        { label: 'Xtreme (antena)', value: 'xtreme' },
      ],
    },
    {
      name: 'categoriaFibra',
      label: 'Categoría de fibra',
      type: 'select',
      admin: {
        condition: (data) => data?.tipo === 'fibra',
        description: 'Solo aplica a planes de Fibra Óptica.',
      },
      options: [
        { label: 'Go Home', value: 'go-home' },
        { label: 'Business', value: 'business' },
        { label: 'Cooperativo', value: 'cooperativo' },
        { label: 'Enterprise', value: 'enterprise' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'download',
          label: 'Download (Mbps)',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'upload',
          label: 'Upload (Mbps)',
          type: 'number',
          required: true,
          min: 0,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'priceUSD',
          label: 'Precio (USD)',
          type: 'number',
          required: true,
          min: 0,
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'priceGs',
          label: 'Precio referencial (Gs)',
          type: 'number',
          min: 0,
        },
      ],
    },
    {
      name: 'wifiAccessPoints',
      label: 'Puntos de WiFi incluidos (comodato)',
      type: 'number',
      min: 0,
      defaultValue: 0,
    },
    {
      name: 'firstMonthFree',
      label: 'Primer mes gratuito',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'ports',
      label: 'Puertos',
      type: 'text',
    },
    {
      name: 'idealFor',
      label: 'Ideal para',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['casa'],
      options: [
        { label: 'Casa', value: 'casa' },
        { label: 'Empresa', value: 'empresa' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'zonaUrbana',
          label: 'Disponible en zona urbana',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'zonaRural',
          label: 'Disponible en zona rural',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'coverageCities',
      label: 'Ciudades con cobertura',
      type: 'relationship',
      relationTo: 'ciudades',
      hasMany: true,
      admin: {
        description: 'Ciudades donde este plan está disponible.',
      },
    },
  ],
}
