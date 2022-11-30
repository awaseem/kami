import { App } from '@slack/bolt'
import { Controllers } from '../../controllers'
import { handleSlackError, UserViewError } from '../../utils/error'
import { saySilent, sayToThread } from '../../utils/slack'

const QUESTION_REGEX = /[A-Za-z\s]*\?/

const CREATE_FAQ_SHORTCUT_MESSAGE = 'create_faq_message_shortcut'
const SEARCH_FAQ_SHORTCUT_MESSAGE = 'search_faq_shortcut_message'

export function createFaqHandlers(app: App, controllers: Controllers) {
  app.message(QUESTION_REGEX, async ({ message, client, context }) => {
    // filter out messages with subtypes
    if (message.subtype !== undefined) {
      return
    }

    const userId = message.user
    const channelId = message.channel
    const messageTs = message.ts

    try {
      const teamId = context.teamId
      if (!teamId) {
        throw new Error('invalid team id.')
      }
      const messageText = message.text
      if (!messageText) {
        throw new Error('failed to find any message text')
      }

      const faqMessage = await controllers.faq.searchFaq({
        teamId,
        message: messageText,
      })
      if (faqMessage) {
        await sayToThread(client, channelId, userId, faqMessage, messageTs)
        return
      }
    } catch (error) {
      handleSlackError(error as Error, userId, client)
    }
  })

  app.shortcut(
    CREATE_FAQ_SHORTCUT_MESSAGE,
    async ({ client, shortcut, ack, context, body }) => {
      const userId = shortcut.user.id

      try {
        await ack()

        const teamId = context.teamId
        if (!teamId) {
          throw new Error('invalid team id.')
        }
        if (shortcut.type !== 'message_action') {
          return
        }

        const channelName = shortcut.channel.name
        const channelId = shortcut.channel.id

        const messageTs = shortcut.message_ts
        const threadTs = shortcut.message.thread_ts
        if (!threadTs || threadTs === messageTs) {
          throw new UserViewError(
            'You can only create FAQs from within a thread. Please select a response from within a thread to create a FAQ. The question will be the parent message and the answer will be message you choose to create the FAQ with.',
          )
        }

        const answer = shortcut.message.text
        if (!answer) {
          throw new Error('Failed to find the message')
        }

        const username = body.user.username
        if (!username) {
          throw new Error('Failed to find username')
        }

        const { permalink } = await client.chat.getPermalink({
          channel: channelId,
          message_ts: messageTs,
        })
        if (!permalink) {
          throw new Error('Failed to find permalinks for thread')
        }

        const parentMessage = await client.conversations.history({
          channel: channelId,
          limit: 1,
          inclusive: true,
          latest: threadTs,
        })
        const question = parentMessage.messages?.[0].text
        if (!question) {
          throw new Error('Failed to find question')
        }

        const page = await controllers.faq.createFaq({
          teamId,
          channelName,
          userId,
          question,
          username,
          threadUrl: permalink,
          answer,
        })

        await sayToThread(
          client,
          channelId,
          userId,
          `Hi 👋, We created the following <${page.url}|notion page> for this FAQ.`,
          threadTs,
        )
      } catch (error) {
        handleSlackError(error as Error, userId, client)
      }
    },
  )

  app.shortcut(
    SEARCH_FAQ_SHORTCUT_MESSAGE,
    async ({ client, shortcut, ack, context }) => {
      const userId = shortcut.user.id
      try {
        await ack()

        const teamId = context.teamId
        if (!teamId) {
          throw new Error('invalid team id.')
        }
        if (shortcut.type !== 'message_action') {
          return
        }

        const message = shortcut.message.text
        if (!message) {
          throw new Error('failed to find message')
        }
        const channelId = shortcut.channel.id
        const messageTs = shortcut.message.thread_ts

        const faqMessage = await controllers.faq.searchFaq({ teamId, message })
        await saySilent(
          client,
          channelId,
          userId,
          faqMessage ?? `Sorry I couldn't find anything`,
          messageTs,
        )
      } catch (error) {
        handleSlackError(error as Error, userId, client)
      }
    },
  )
}
