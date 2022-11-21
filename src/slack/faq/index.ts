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
        console.log(JSON.stringify(shortcut, null, 2))

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
        const threadId = shortcut.message.thread_ts
        if (!threadId || threadId === messageTs) {
          throw new UserViewError(
            'You can only create FAQs from within a thread. Please select a response from within a thread to create a FAQ. The question will be the parent message and the answer will be message you choose to create the FAQ with.',
          )
        }

        const username = body.user.username
        if (!username) {
          throw new Error('Failed to find username')
        }

        const accessToken = await controllers.auth.getAccessToken(teamId)

        await controllers.faq.createFaq({
          accessToken,
          teamId,
          channelId,
          channelName,
          userId,
          threadId,
          question: 'test',
          username,
        })
      } catch (error) {
        handleSlackError(error as Error, userId, client)
      }
    },
  )
}
