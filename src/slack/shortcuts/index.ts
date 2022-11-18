import type {
  AllMiddlewareArgs,
  App,
  SlackShortcut,
  SlackShortcutMiddlewareArgs,
} from '@slack/bolt'
import { StringIndexed } from '@slack/bolt/dist/types/helpers'
import { Controllers } from '../../controllers'
import type { Models } from '../../models'
import { logEventError, respondError } from '../../utils/logger'
import {
  foundAcronymMessage,
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

type SlackShortcutArg = SlackShortcutMiddlewareArgs<SlackShortcut> &
  AllMiddlewareArgs<StringIndexed>

const CREATE_ACRONYM_SHORTCUT_GLOBAL = 'define_acronym'
const CREATE_ACRONYM_SHORTCUT_MESSAGE = 'create_acronym_message_shortcut'
const DEFINE_ACRONYM_SHORTCUT_MESSAGE = 'define_acronym_message_shortcut'

export function createShortcutHandlers(
  app: App,
  models: Models,
  controller: Controllers,
) {
  async function handleCreateAcronymShortcuts({
    ack,
    shortcut,
    context,
    client,
    respond,
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

      await createAcronymModal(client, triggerId, {
        acronym,
        definition,
      })
    } catch (error) {
      respondError(CREATE_ACRONYM_SHORTCUT_GLOBAL, error as Error, respond)
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
    async ({ ack, shortcut, client, context }) => {
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
            shortcut.message.thread_ts,
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

        const foundAcronyms = await models.acronyms.queryAcronyms(
          accessToken,
          databaseId,
          acronyms,
        )
        if (foundAcronyms.length === 0) {
          await saySilent(
            client,
            shortcut.channel.id,
            shortcut.user.id,
            'Sorry no acronyms were found.',
            shortcut.message.thread_ts,
          )
          return
        }

        const replyMessage = foundAcronymMessage(foundAcronyms)
        await saySilent(
          client,
          shortcut.channel.id,
          shortcut.user.id,
          replyMessage,
          shortcut.message.thread_ts,
        )
      } catch (error) {
        logEventError(DEFINE_ACRONYM_SHORTCUT_MESSAGE, error as Error)
      }
    },
  )

  app.view(
    CREATE_ACRONYM_CALLBACK_ID,
    async ({ ack, context, view, body, respond }) => {
      try {
        await ack()

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

        const accessToken = await controller.auth.getAccessToken(teamId)

        await controller.acronym.createAcronym({
          acronym,
          definition,
          accessToken,
          teamId,
          userId: user.id,
          username: user.name,
        })
      } catch (error) {
        respondError(CREATE_ACRONYM_CALLBACK_ID, error as Error, respond)
      }
    },
  )
}
