import { WebClient } from '@slack/web-api'
import { logError } from './logger'

export class ControllerError extends Error {
  constructor(msg: string) {
    super(`Whoops: ${msg}`)
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ControllerError.prototype)
  }

  async postMessage(client: WebClient, userId: string) {
    await client.chat.postMessage({
      channel: userId,
      mrkdwn: true,
      text: `🚨 Whoops! we encountered the following error: ${this.message}`,
    })
  }
}

export class NotionError extends Error {
  constructor(error: Error) {
    super(`[NOTION ERROR]: ${error.message}`)
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, NotionError.prototype)
  }

  async postMessage(client: WebClient, userId: string) {
    await client.chat.postMessage({
      channel: userId,
      mrkdwn: true,
      text: `🚨 Whoops! There is something wrong with your notion integration. Either the page Kami is writing to is deleted or the access token we have is expired or incorrect. To help you try these following steps: 
- Re-integrate Kami by connecting again from the app home in Slack
- Assign a new page for Kami to store information`,
    })
  }
}

export async function handleSlackError(
  error: Error,
  userId: string,
  client: WebClient,
) {
  try {
    if (error instanceof NotionError || error instanceof ControllerError) {
      await error.postMessage(client, userId)
      return
    }

    if (error.message.includes('not_in_channel')) {
      await client.chat.postMessage({
        channel: userId,
        mrkdwn: true,
        text: `🤔 Whoops! You need to add Kami to the channel.`,
      })
    }

    logError(error as Error)
  } catch (error) {
    logError(error as Error)
  }
}
