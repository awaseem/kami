import { isFullPage } from '@notionhq/client'
import { Models } from '../models'
import { ControllerError } from '../utils/error'
import { foundFaqMessage, getKeywords } from '../utils/messages'
import { databaseResponseToFaqs } from '../utils/notion'

export interface CreateFaqArgs {
  teamId: string
  question: string
  channelName: string
  threadUrl: string
  userId: string
  username: string
  answer: string
}

export interface SearchFaqArgs {
  teamId: string
  message: string
}

export function createFaqControllers(models: Models) {
  async function searchFaq({ teamId, message }: SearchFaqArgs) {
    const accessToken =
      await models.accessTokens.notionAccessTokenStore.getAccessToken(teamId)
    if (!accessToken) {
      throw new ControllerError('no access token has been found')
    }

    const databaseId = await models.notion.getFaqPageId(teamId)
    if (!databaseId) {
      throw new ControllerError(
        'Failed to find a FAQ page associated with this integration',
      )
    }

    const keywords = getKeywords(message)
    if (keywords.length === 0) {
      return 'Sorry no FAQs found.'
    }

    const faqResponse = await models.faq.queryFaq(
      accessToken,
      databaseId,
      keywords,
    )

    const faqs = databaseResponseToFaqs(faqResponse)
    return faqs.length !== 0 ? foundFaqMessage(faqs) : undefined
  }

  async function createFaq({
    teamId,
    question,
    channelName,
    threadUrl,
    userId,
    username,
    answer,
  }: CreateFaqArgs) {
    const accessToken =
      await models.accessTokens.notionAccessTokenStore.getAccessToken(teamId)
    if (!accessToken) {
      throw new ControllerError('no access token has been found')
    }

    const databaseId = await models.notion.getFaqPageId(teamId)
    if (!databaseId) {
      throw new ControllerError(
        'Failed to find a FAQ page associated with this integration',
      )
    }

    const response = await models.faq.createFaq({
      databaseId,
      accessToken,
      userId,
      username,
      threadUrl,
      question,
      answer,
      channelName: `#${channelName}`,
    })

    if (!isFullPage(response)) {
      throw new ControllerError(
        'The page may have been created, but we received a non full page from Notion',
      )
    }

    return response
  }

  return Object.freeze({
    createFaq,
    searchFaq,
  })
}
