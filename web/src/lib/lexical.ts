import { mediaUrl } from './payload'

const PAYLOAD_URL = import.meta.env.PAYLOAD_URL || 'https://cms.sol.com.py'

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function renderText(node: any): string {
  let text = escapeHtml(node.text ?? '')
  const format = node.format ?? 0
  if (format & 16) text = `<code>${text}</code>`
  if (format & 1) text = `<strong>${text}</strong>`
  if (format & 2) text = `<em>${text}</em>`
  if (format & 8) text = `<u>${text}</u>`
  if (format & 4) text = `<s>${text}</s>`
  return text
}

function renderChildren(children: any[] | undefined): string {
  if (!children) return ''
  return children.map(renderNode).join('')
}

function renderNode(node: any): string {
  if (!node || typeof node !== 'object') return ''

  switch (node.type) {
    case 'text':
      return renderText(node)
    case 'paragraph':
      return `<p>${renderChildren(node.children)}</p>`
    case 'heading': {
      const tag = node.tag || 'h2'
      return `<${tag}>${renderChildren(node.children)}</${tag}>`
    }
    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      return `<${tag}>${renderChildren(node.children)}</${tag}>`
    }
    case 'listitem':
      return `<li>${renderChildren(node.children)}</li>`
    case 'link': {
      const url = node.fields?.url ?? '#'
      const target = node.fields?.newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
      return `<a href="${escapeHtml(url)}"${target}>${renderChildren(node.children)}</a>`
    }
    case 'upload': {
      const media = node.value
      if (!media) return ''
      const url = media.url ? `${PAYLOAD_URL}${media.url}` : mediaUrl(media)
      return `<img src="${url}" alt="${escapeHtml(media.alt ?? '')}" />`
    }
    case 'linebreak':
      return '<br />'
    default:
      return renderChildren(node.children)
  }
}

export function renderLexical(content: any): string {
  const root = content?.root
  if (!root) return ''
  return renderChildren(root.children)
}
