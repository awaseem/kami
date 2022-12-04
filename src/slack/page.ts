import { App } from '@slack/bolt'
import { Controllers } from '../controllers'
import { handleSlackError } from '../utils/error'
import {
  createPageWithPromptView,
  CREATE_PAGE_PROMPT_CALLBACK_ID,
  CREATE_PAGE_PROMPT_INPUT_LABEL,
  CREATE_PAGE_PROMPT_INPUT_LABEL_ACTION,
} from './views/page'

const CREATE_PAGE_PROMPT_GLOBAL_CALLBACK_ID = 'create_page_prompt_global'

export function createPageHandlers(app: App, controller: Controllers) {
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
