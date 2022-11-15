import { isFullPage } from '@notionhq/client'
import type {
  PageObjectResponse,
  QueryDatabaseResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints'
import { getNotionPageUrl } from './links'

export interface Acronym {
  acronym: string
  definition: string
  link: string
}

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

function combineRichText(richTextItems: RichTextItemResponse[]): string {
  return richTextItems.map((val) => val.plain_text).join('')
}

function pageObjectResponseToAcronym(
  page: PageObjectResponse,
): Acronym | undefined {
  const acronymProp = page.properties['Acronym']
  const definitionProp = page.properties['Definition']

  if (!acronymProp || !definitionProp) {
    return
  }

  const acronym =
    acronymProp.type === 'title'
      ? combineRichText(acronymProp.title)
      : undefined
  const definition =
    acronymProp.type === 'rich_text'
      ? combineRichText(acronymProp.rich_text)
      : undefined

  if (!acronym || !definition) {
    return
  }

  const link = getNotionPageUrl(page.id)
  return {
    link,
    acronym,
    definition,
  }
}

export function databaseResponseToAcronyms(response: QueryDatabaseResponse) {
  const pages = response.results.filter(isFullPage) as Array<PageObjectResponse>
  return pages
    .map(pageObjectResponseToAcronym)
    .filter(Boolean) as Array<Acronym>
}
