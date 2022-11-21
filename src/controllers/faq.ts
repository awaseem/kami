import { isFullPage } from '@notionhq/client'
import { Models } from '../models'
import { ControllerError } from '../utils/error'

export interface CreateFaqArgs {
  teamId: string
  question: string
  channelName: string
  threadUrl: string
  userId: string
  username: string
  answer: string
}

export function createFaqControllers(models: Models) {
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
  })
}
