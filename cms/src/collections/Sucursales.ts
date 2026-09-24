import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

export const Sucursales: CollectionConfig = {
  slug: 'sucursales',
  labels: {
    singular: 'Sucursal',
    plural: 'Sucursales',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'city', 'callCenterPhone'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      label: 'Nombre',
      type: 'text',
      required: true,
    },
    slugField('name'),
    {
      name: 'image',
      label: 'Imagen',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'city',
      label: 'Ciudad',
      type: 'relationship',
      relationTo: 'ciudades',
    },
    {
      name: 'businessHours',
      label: 'Horario de funcionamiento',
      type: 'textarea',
    },
    {
      name: 'googleMapsUrl',
      label: 'Enlace de Google Maps (botón "Ver localización")',
      type: 'text',
    },
    {
      name: 'coordinates',
      label: 'Coordenadas (para el mapa con pines)',
      type: 'group',
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'lat',
              label: 'Latitud',
              type: 'number',
              min: -90,
              max: 90,
            },
            {
              name: 'lng',
              label: 'Longitud',
              type: 'number',
              min: -180,
              max: 180,
            },
          ],
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'managerContactLink',
          label: 'Enlace de contacto (encargado)',
          type: 'text',
        },
        {
          name: 'serviceCoordinatorPhone',
          label: 'Coordinador de servicios (asistencia técnica)',
          type: 'text',
          admin: {
            description: 'Para solicitar asistencia técnica o ver el estado de una asistencia.',
          },
        },
        {
          name: 'callCenterPhone',
          label: 'Call Center',
          type: 'text',
          defaultValue: '*10000',
          admin: {
            description:
              'Si la sucursal no tiene un número propio, se usa el *10000 (gratuito, de la empresa).',
          },
        },
      ],
    },
  ],
}
