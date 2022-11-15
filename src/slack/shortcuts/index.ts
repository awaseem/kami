import type {
  AllMiddlewareArgs,
  App,
  SlackShortcut,
  SlackShortcutMiddlewareArgs,
} from '@slack/bolt'
import { StringIndexed } from '@slack/bolt/dist/types/helpers'
import type { Models } from '../../models'
import { getAppHomeDeepLink } from '../../utils/links'
import { logEventError } from '../../utils/logger'
import {
  getFirstFoundAcronym,
  getFoundAcronyms,
  parseMessageBlocks,
} from '../../utils/messages'
import { saySilent } from '../../utils/slack'
import {
  createAcronymModal,
  CREATE_ACRONYM_CALLBACK_ID,
  CREATE_ACRONYM_INPUT_DESCRIPTION,
  CREATE_ACRONYM_INPUT_DESCRIPTION_ACTION,
  CREATE_ACRONYM_INPUT_LABEL,
  CREATE_ACRONYM_INPUT_LABEL_ACTION,
} from '../views/acronyms'
import { ErrorModel } from '../views/error'

type SlackShortcutArg = SlackShortcutMiddlewareArgs<SlackShortcut> &
  AllMiddlewareArgs<StringIndexed>

const CREATE_ACRONYM_SHORTCUT_GLOBAL = 'define_acronym'
const CREATE_ACRONYM_SHORTCUT_MESSAGE = 'create_acronym_message_shortcut'
const DEFINE_ACRONYM_SHORTCUT_MESSAGE = 'define_acronym_message_shortcut'

export function createShortcutHandlers(app: App, models: Models) {
  async function handleCreateAcronymShortcuts({
    ack,
    shortcut,
    context,
    client,
    logger,
  }: SlackShortcutArg) {
    try {
      await ack()

      const definition =
        shortcut.type === 'message_action'
          ? parseMessageBlocks(shortcut.message.blocks)
          : undefined

      const acronym = definition ? getFirstFoundAcronym(definition) : undefined

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

      await createAcronymModal(client, triggerId, {
        acronym,
        definition,
      })
    } catch (error) {
      logEventError(logger, CREATE_ACRONYM_SHORTCUT_GLOBAL, error as Error)
    }
  }

  app.shortcut(CREATE_ACRONYM_SHORTCUT_GLOBAL, async (args) => {
    await handleCreateAcronymShortcuts(args)
  })

  app.shortcut(CREATE_ACRONYM_SHORTCUT_MESSAGE, async (args) => {
    await handleCreateAcronymShortcuts(args)
  })

  app.shortcut(
    DEFINE_ACRONYM_SHORTCUT_MESSAGE,
    async ({ ack, logger, shortcut, client, context }) => {
      try {
        await ack()

        if (shortcut.type !== 'message_action') {
          return
        }

        const message = parseMessageBlocks(shortcut.message.blocks)
        if (!message) {
          return
        }

        const acronyms = getFoundAcronyms(message)
        if (!acronyms) {
          await saySilent(
            client,
            shortcut.channel.id,
            shortcut.user.id,
            'Sorry no acronyms were found.',
            shortcut.message_ts,
          )
          return
        }

        const teamId = context.teamId
        if (!teamId) {
          throw new Error('invalid team id.')
        }

        const accessToken =
          await models.accessTokens.notionAccessTokenStore.getAccessTokenOrThrow(
            teamId,
          )
        const databaseId = await models.notion.getAcronymPageIdOrThrow(teamId)

        console.log(
          await models.acronyms.queryAcronym(
            accessToken,
            databaseId,
            acronyms[0],
          ),
        )
      } catch (error) {
        logEventError(logger, DEFINE_ACRONYM_SHORTCUT_MESSAGE, error as Error)
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
          databaseId: parentPageId,
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
