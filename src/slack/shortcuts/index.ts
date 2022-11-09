import type { App } from '@slack/bolt'
import type { Models } from '../../models'
import { getAppHomeDeepLink } from '../../utils/links'
import { logEventError } from '../../utils/logger'
import { ErrorModel } from '../views/error'

const CREATE_ACRONYM_SHORTCUT = 'define_acronym'

export function createShortcutHandlers(app: App, models: Models) {
  app.shortcut(
    'define_acronym',
    async ({ shortcut, ack, client, logger, context }) => {
      try {
        await ack()

        const triggerId = shortcut.trigger_id

        const { teamId } = context
        if (!teamId) {
          throw new Error('no team id found')
        }

        const validIntegration =
          await models.accessTokens.notionAccessTokenStore.isValidNotionInstall(
            teamId,
          )

        if (!validIntegration) {
          await ErrorModel(
            client,
            triggerId,
            `Your integration to notion has not been setup. Please configure within the app home <${getAppHomeDeepLink(
              teamId,
            )}}|here>`,
          )
        }

        // Call the views.open method using one of the built-in WebClients
        const result = await client.views.open({
          trigger_id: shortcut.trigger_id,
          view: {
            type: 'modal',
            title: {
              type: 'plain_text',
              text: 'My App',
            },
            close: {
              type: 'plain_text',
              text: 'Close',
            },
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: 'About the simplest modal you could conceive of :smile:\n\nMaybe <https://api.slack.com/reference/block-kit/interactive-components|*make the modal interactive*> or <https://api.slack.com/surfaces/modals/using#modifying|*learn more advanced modal use cases*>.',
                },
              },
              {
                type: 'context',
                elements: [
                  {
                    type: 'mrkdwn',
                    text: 'Psssst this modal was designed using <https://api.slack.com/tools/block-kit-builder|*Block Kit Builder*>',
                  },
                ],
              },
            ],
          },
        })

        logger.info(result)
      } catch (error) {
        logEventError(logger, CREATE_ACRONYM_SHORTCUT, error as Error)
      }
    },
  )
}
