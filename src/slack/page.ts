import { App } from '@slack/bolt'
import { Controllers } from '../controllers'
import { handleSlackError, UserViewError } from '../utils/error'
import {
  createPageWithPromptView,
  CREATE_PAGE_PROMPT_CALLBACK_ID,
  CREATE_PAGE_PROMPT_INPUT_LABEL,
  CREATE_PAGE_PROMPT_INPUT_LABEL_ACTION,
} from './views/page'

const CREATE_PAGE_PROMPT_GLOBAL_CALLBACK_ID = 'create_page_prompt_global'
const CREATE_SUMMARY_PAGE_MESSAGE_CALLBACK_ID = 'create_summary_page_message'

export function createPageHandlers(app: App, controller: Controllers) {
  app.shortcut(
    CREATE_SUMMARY_PAGE_MESSAGE_CALLBACK_ID,
    async ({ ack, client, shortcut, context }) => {
      const userId = shortcut.user.id

      try {
        await ack()

        if (shortcut.type !== 'message_action') {
          return
        }

        const teamId = context.teamId
        if (!teamId) {
          throw new Error('invalid team id.')
        }

        const channelId = shortcut.channel.id
        const messageTs = shortcut.message_ts
        if (shortcut.message.thread_ts !== messageTs) {
          throw new UserViewError(
            'You can only create summary pages from the parent message of a thread.',
          )
        }

        const { messages } = await client.conversations.replies({
          ts: messageTs,
          channel: channelId,
        })
        if (!messages) {
          throw new UserViewError(
            'No message replies were found when trying to create a summary page',
          )
        }

        const page = await controller.page.createSummaryPageFromMessages(
          teamId,
          messages,
        )

        const { permalink } = await client.chat.getPermalink({
          channel: channelId,
          message_ts: messageTs,
        })

        await client.chat.postMessage({
          channel: userId,
          mrkdwn: true,
          text: `Hello 👋. ${
            permalink
              ? `We finished creating a summary for the following <${permalink}|thread>`
              : 'We finished processing a summary for a thread'
          }. We created the following <${page.url}|Notion Page>.`,
        })
      } catch (error) {
        handleSlackError(error as Error, userId, client)
      }
    },
  )

  app.shortcut(
    CREATE_PAGE_PROMPT_GLOBAL_CALLBACK_ID,
    async ({ ack, client, shortcut }) => {
      try {
        await ack()

        const triggerId = shortcut.trigger_id

        await createPageWithPromptView(client, triggerId)
      } catch (error) {
        handleSlackError(error as Error, shortcut.user.id, client)
      }
    },
  )

  app.view(
    CREATE_PAGE_PROMPT_CALLBACK_ID,
    async ({ ack, context, view, body, client }) => {
      try {
        await ack()

        const teamId = context.teamId
        const userId = body.user.id

        if (!teamId) {
          throw new Error('invalid team id.')
        }

        const prompt =
          view.state.values[CREATE_PAGE_PROMPT_INPUT_LABEL]?.[
            CREATE_PAGE_PROMPT_INPUT_LABEL_ACTION
          ]?.value
        if (!prompt) {
          throw new Error('invalid prompt.')
        }

        const page = await controller.page.createPageFromPrompt(teamId, prompt)

        await client.chat.postMessage({
          channel: userId,
          mrkdwn: true,
          text: `Hello 👋. For the following prompt: ${prompt}. We created the following <${page.url}|Notion Page>.`,
        })
      } catch (error) {
        handleSlackError(error as Error, body.user.id, client)
      }
    },
  )
}
