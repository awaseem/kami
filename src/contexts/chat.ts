import { App, Installation } from '@slack/bolt'
import { logWarn } from '../utils/logger'
import { SlackModel } from '../models/slack'

export type ChatContext = ReturnType<typeof createChatContext>

export function createChatContext(app: App, slackModel: SlackModel) {
  // Use this method for sending messages when not listening to events or where the WebClient isn't available
  async function sendDirectMessage(
    teamId: string,
    userId: string,
    message: string,
  ) {
    const install = (await slackModel.getInstall(teamId)) as Installation
    if (!install) {
      logWarn(
        'SEND DIRECT MESSAGE',
        `Failed to get install for team: ${teamId}`,
      )
      return
    }

    const token = install?.bot?.token
    if (!token) {
      logWarn(
        'SEND DIRECT MESSAGE',
        `Failed to get token for team based on the install object: ${teamId}`,
      )
      return
    }

    await app.client.chat.postMessage({
      token,
      channel: userId,
      mrkdwn: true,
      text: message,
    })
  }

  return Object.freeze({
    sendDirectMessage,
  })
}
