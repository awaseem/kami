import { App } from '@slack/bolt'
import { Controllers } from '../../controllers'
import { handleSlackError, UserViewError } from '../../utils/error'

const CREATE_FAQ_SHORTCUT_MESSAGE = 'create_faq_message_shortcut'

export function createFaqHandlers(app: App, controllers: Controllers) {
  app.shortcut(
    CREATE_FAQ_SHORTCUT_MESSAGE,
    async ({ client, shortcut, ack, context, body }) => {
      const userId = body.user.id

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

        const accessToken = await controllers.auth.getAccessToken(teamId)

        await controllers.faq.createFaq({
          accessToken,
          teamId,
          channelName,
          userId,
          question,
          username,
          threadUrl: permalink,
          answer,
        })
      } catch (error) {
        handleSlackError(error as Error, userId, client)
      }
    },
  )
}
