export function getPageIdFromNotionUrl(notionUrl: string): string | undefined {
  const url = new URL(notionUrl)
  const paths = url.pathname.split('/').filter((path) => path !== '')

  const firstPath = paths[0]
  if (!firstPath) {
    return undefined
  }

  const noDashes = firstPath.split('-').filter((path) => path !== '')
  const pageId = noDashes.at(-1)
  return pageId
}
