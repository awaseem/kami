import { Acronym, Question } from './notion'
import { removeStopwords } from 'stopword'
import { Message } from '@slack/web-api/dist/response/ConversationsRepliesResponse'

const ACRONYM_MATCHER = /\b[A-Z]*[a-z]*[A-Z]s?\d*[A-Z]*[-\w+]\b/g

export type SlackReply = Message

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

export function foundAcronymMessage(acronyms: Acronym[]): string {
  const acronymMessage = acronyms
    .map(
      (acr) =>
        `• *${acr.acronym}*: ${acr.definition}. <${acr.link}|Notion Page>`,
    )
    .join('\n')

  return `Here's what I found 🔮:

${acronymMessage}
`
}

export function foundFaqMessage(questions: Question[]): string {
  const faqMessage = questions
    .map((acr) => `• *${acr.question}* - <${acr.link}|Notion answer Page>`)
    .join('\n')

  return `Here's similar questions asked 🔮:

${faqMessage}
`
}

export function getKeywords(text: string): string[] {
  return removeStopwords(text.split(' '))
}

export function cleanSlackReplies(replies: SlackReply[]): string[] {
  return (
    replies
      .filter((reply) => reply.type === 'message')
      // Filter bot messages
      .filter((reply) => reply.bot_id === undefined)
      .map((reply) => reply.text)
      .filter(Boolean) as string[]
  )
}

export function genBooleanEmoji(bool: boolean): string {
  return bool ? '✅' : '❌'
}
