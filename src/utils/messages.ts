const ACRONYM_MATCHER = /\b[A-Z]*[a-z]*[A-Z]s?\d*[A-Z]*[-\w+]\b/g

export interface Block {
  block_id?: string
  elements?: Array<{
    elements?: Array<{
      type?: string
      text?: string
    }>
  }>
}

export function parseMessageBlocks(
  blocks: Block[] | undefined,
): string | undefined {
  return blocks?.[0]?.elements?.[0].elements
    ?.map((element) => element.text)
    .join('')
}

export function getFirstFoundAcronym(text: string): string | undefined {
  const matches = text.match(ACRONYM_MATCHER)
  return matches?.at(0)
}

export function getFoundAcronyms(text: string): string[] | undefined {
  const matches = text.match(ACRONYM_MATCHER)
  if (!matches) {
    return undefined
  }

  return Array.from(matches)
}
