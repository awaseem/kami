import type { App } from '@slack/bolt'
import type { Models } from '../../models'
import { getAppHomeDeepLink } from '../../utils/links'
import { logEventError } from '../../utils/logger'
import {
  createAcronymModal,
  CREATE_ACRONYM_CALLBACK_ID,
} from '../views/acronyms'
import { ErrorModel } from '../views/error'

const CREATE_ACRONYM_SHORTCUT = 'define_acronym'

export function createShortcutHandlers(app: App, models: Models) {
  app.shortcut(
    CREATE_ACRONYM_SHORTCUT,
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

        const result = await createAcronymModal(client, triggerId)
      } catch (error) {
        logEventError(logger, CREATE_ACRONYM_SHORTCUT, error as Error)
      }
    },
  )

  app.view(
    CREATE_ACRONYM_CALLBACK_ID,
    async ({ ack, context, view, client, logger }) => {
      try {
        await ack()

        console.log('CONTEXT', context)
        console.log('VIEW', view)
      } catch (error) {
        logEventError(logger, CREATE_ACRONYM_CALLBACK_ID, error as Error)
      }
    },
  )
}
