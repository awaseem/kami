import type { App } from '@slack/bolt'
import type { Models } from '../../models'
import { getAppHomeDeepLink } from '../../utils/links'
import { logEventError } from '../../utils/logger'
import {
  createAcronymModal,
  CREATE_ACRONYM_CALLBACK_ID,
  CREATE_ACRONYM_INPUT_DESCRIPTION,
  CREATE_ACRONYM_INPUT_DESCRIPTION_ACTION,
  CREATE_ACRONYM_INPUT_LABEL,
  CREATE_ACRONYM_INPUT_LABEL_ACTION,
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

        await createAcronymModal(client, triggerId)
      } catch (error) {
        logEventError(logger, CREATE_ACRONYM_SHORTCUT, error as Error)
      }
    },
  )

  app.view(
    CREATE_ACRONYM_CALLBACK_ID,
    async ({ ack, context, view, logger, body }) => {
      try {
        const teamId = context.teamId
        const user = body.user

        if (!teamId) {
          throw new Error('invalid team id.')
        }

        const acronym =
          view.state.values[CREATE_ACRONYM_INPUT_LABEL]?.[
            CREATE_ACRONYM_INPUT_LABEL_ACTION
          ]?.value
        const definition =
          view.state.values[CREATE_ACRONYM_INPUT_DESCRIPTION]?.[
            CREATE_ACRONYM_INPUT_DESCRIPTION_ACTION
          ]?.value

        if (!acronym || !definition) {
          throw new Error('Failed to find acronym or definition')
        }

        await ack()

        const accessToken =
          await models.accessTokens.notionAccessTokenStore.getAccessTokenOrThrow(
            teamId,
          )
        const parentPageId = await models.notion.getAcronymPageIdOrThrow(teamId)

        await models.acronyms.createAcronym({
          accessToken,
          parentPageId,
          acronym,
          definition,
          userId: user.id,
          username: user.name,
        })
      } catch (error) {
        logEventError(logger, CREATE_ACRONYM_CALLBACK_ID, error as Error)
      }
    },
  )
}
