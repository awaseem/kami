import { Models } from '../models'
import { ControllerError } from '../utils/error'
import { getChannelLink } from '../utils/links'

export interface CreateFaqArgs {
  accessToken: string
  teamId: string
  question: string
  channelId: string
  channelName: string
  threadId: string
  userId: string
  username: string
}

export function createFaqControllers(models: Models) {
  async function createFaq({
    accessToken,
    teamId,
    question,
    channelId,
    channelName,
    threadId,
    userId,
    username,
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
      channelUrl: getChannelLink(channelId),
      channelName,
      userId,
      username,
      threadId,
      question,
    })
  }

  return Object.freeze({
    createFaq,
  })
}
