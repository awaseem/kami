import { isFullPage } from '@notionhq/client'
import { Models } from '../models'
import { ControllerError } from '../utils/error'

export interface CreateFaqArgs {
  accessToken: string
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
    accessToken,
    teamId,
    question,
    channelName,
    threadUrl,
    userId,
    username,
    answer,
  }: CreateFaqArgs) {
    const databaseId = await models.notion.getFaqPageId(teamId)
    if (!databaseId) {
      throw new ControllerError(
        'Failed to find a FAQ page associated with this integration',
      )
    }

    await models.faq.createFaq({
      databaseId,
      accessToken,
      userId,
      username,
      threadUrl,
      question,
      answer,
      channelName: `#${channelName}`,
    })
  }

  return Object.freeze({
    createFaq,
  })
}
