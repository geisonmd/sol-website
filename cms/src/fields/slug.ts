import type { Field } from 'payload'

const formatSlug = (val: string): string =>
  val
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const slugField = (fieldToUse = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  index: true,
  unique: true,
  admin: {
    position: 'sidebar',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (value) return formatSlug(value)
        if (data?.[fieldToUse]) return formatSlug(data[fieldToUse])
        return value
      },
    ],
  },
})
