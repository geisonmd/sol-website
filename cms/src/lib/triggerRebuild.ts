/**
 * Fires a GitHub `repository_dispatch` event so the Astro site's CI
 * workflow rebuilds (and redeploys) static pages whenever content changes.
 *
 * No-ops silently when GITHUB_DISPATCH_REPO / GITHUB_DISPATCH_TOKEN aren't
 * set yet (e.g. in local dev, or before the production webhook is wired up),
 * and never throws — a failed rebuild ping must never fail a CMS save.
 */
export async function triggerRebuild(reason: string): Promise<void> {
  const repo = process.env.GITHUB_DISPATCH_REPO
  const token = process.env.GITHUB_DISPATCH_TOKEN
  if (!repo || !token) return

  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({
        event_type: process.env.GITHUB_DISPATCH_EVENT_TYPE || 'payload-content-changed',
        client_payload: { reason },
      }),
    })
    if (!res.ok) {
      console.error(`[triggerRebuild] GitHub dispatch failed: ${res.status} ${await res.text()}`)
    }
  } catch (err) {
    console.error('[triggerRebuild] failed to dispatch rebuild:', err)
  }
}

export function rebuildHooks(collectionLabel: string) {
  return {
    afterChange: [
      ({ doc }: { doc: { id: unknown } }) => {
        void triggerRebuild(`${collectionLabel} updated: ${doc.id}`)
      },
    ],
    afterDelete: [
      ({ id }: { id: unknown }) => {
        void triggerRebuild(`${collectionLabel} deleted: ${id}`)
      },
    ],
  }
}
