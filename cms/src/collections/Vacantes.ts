import type { CollectionConfig } from 'payload'

import { slugField } from '../fields/slug'

const toggleableSection = (name: string, label: string, defaultEnabled = true) => ({
  name,
  label,
  type: 'group' as const,
  fields: [
    {
      name: 'enabled',
      label: `Mostrar sección "${label}"`,
      type: 'checkbox' as const,
      defaultValue: defaultEnabled,
    },
    {
      name: 'content',
      type: 'richText' as const,
      admin: {
        condition: (_: unknown, siblingData: { enabled?: boolean }) =>
          siblingData?.enabled !== false,
      },
    },
  ],
})

export const Vacantes: CollectionConfig = {
  slug: 'vacantes',
  labels: {
    singular: 'Vacante',
    plural: 'Vacantes',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'city', 'employmentType', 'isOpen', 'publishedAt'],
  },
  access: {
    read: ({ req: { user } }) => {
      if (user) return true
      return {
        _status: {
          equals: 'published',
        },
      }
    },
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      label: 'Título de la vacante',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'featuredImage',
      label: 'Imagen (para compartir en redes)',
      type: 'upload',
      relationTo: 'media',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'publishedAt',
          label: 'Publicada en',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: {
            date: { pickerAppearance: 'dayOnly' },
          },
        },
        {
          name: 'applicationDeadline',
          label: 'Inscripciones abiertas hasta',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'dayOnly' },
          },
        },
        {
          name: 'isOpen',
          label: 'Vacante abierta',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'city',
          label: 'Ciudad',
          type: 'relationship',
          relationTo: 'ciudades',
        },
        {
          name: 'workMode',
          label: 'Modalidad',
          type: 'select',
          options: [
            { label: 'Presencial', value: 'presencial' },
            { label: 'Remoto', value: 'remoto' },
            { label: 'Híbrido', value: 'hibrido' },
          ],
        },
        {
          name: 'employmentType',
          label: 'Tipo de contrato',
          type: 'select',
          options: [
            { label: 'Efectivo', value: 'efectivo' },
            { label: 'Temporal', value: 'temporal' },
            { label: 'Pasantía', value: 'pasantia' },
            { label: 'Freelance', value: 'freelance' },
          ],
        },
        {
          name: 'pcdFriendly',
          label: 'Vacante también para PcD',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
    toggleableSection('description', 'Descripción de la vacante'),
    toggleableSection('responsibilities', 'Responsabilidades y atribuciones'),
    toggleableSection('requirements', 'Requisitos y calificaciones'),
    toggleableSection('additionalInfo', 'Información adicional'),
    {
      name: 'hiringProcess',
      label: 'Etapas del proceso',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          label: 'Mostrar etapas del proceso',
          type: 'checkbox',
          defaultValue: true,
        },
        {
          name: 'steps',
          type: 'array',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled !== false,
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'showCompanyInfo',
      label: 'Mostrar bloque "Somos una de las mayores..." (contenido en Configuración del sitio)',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'showRealTimeCTA',
      label: 'Mostrar CTA "¿Querés ver a Sol Internet en tiempo real?" (redes de Configuración del sitio)',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
