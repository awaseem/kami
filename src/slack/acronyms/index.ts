import type {
  AllMiddlewareArgs,
  App,
  SlackShortcut,
  SlackShortcutMiddlewareArgs,
} from '@slack/bolt'
import { StringIndexed } from '@slack/bolt/dist/types/helpers'
import { Controllers } from '../../controllers'
import { handleSlackError } from '../../utils/error'
import { logEventError } from '../../utils/logger'
import { getFirstFoundAcronym, parseMessageBlocks } from '../../utils/messages'
import { saySilent } from '../../utils/slack'
import {
  createAcronymModal,
  CREATE_ACRONYM_CALLBACK_ID,
  CREATE_ACRONYM_INPUT_DESCRIPTION,
  CREATE_ACRONYM_INPUT_DESCRIPTION_ACTION,
  CREATE_ACRONYM_INPUT_LABEL,
  CREATE_ACRONYM_INPUT_LABEL_ACTION,
  defineAcronymModal,
  DEFINE_ACRONYM_CALLBACK_ID,
  DEFINE_ACRONYM_INPUT_LABEL,
  DEFINE_ACRONYM_INPUT_LABEL_ACTION,
} from '../views/acronyms'

type SlackShortcutArg = SlackShortcutMiddlewareArgs<SlackShortcut> &
  AllMiddlewareArgs<StringIndexed>

const CREATE_ACRONYM_SHORTCUT_GLOBAL = 'define_acronym'
const DEFINE_ACRONYM_SHORTCUT_GLOBAL = 'define_acronym_global'
const CREATE_ACRONYM_SHORTCUT_MESSAGE = 'create_acronym_message_shortcut'
const DEFINE_ACRONYM_SHORTCUT_MESSAGE = 'define_acronym_message_shortcut'

export function createAcronymHandlers(app: App, controller: Controllers) {
  async function handleCreateAcronymShortcuts({
    ack,
    shortcut,
    context,
    client,
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
      handleSlackError(error as Error, shortcut.user.id, client)
    }
  }

  app.shortcut(CREATE_ACRONYM_SHORTCUT_GLOBAL, async (args) => {
    await handleCreateAcronymShortcuts(args)
  })

  app.shortcut(CREATE_ACRONYM_SHORTCUT_MESSAGE, async (args) => {
    await handleCreateAcronymShortcuts(args)
  })

  app.shortcut(
    DEFINE_ACRONYM_SHORTCUT_GLOBAL,
    async ({ ack, shortcut, client }) => {
      try {
        await ack()

        const triggerId = shortcut.trigger_id
        await defineAcronymModal(client, triggerId)
      } catch (error) {
        logEventError(DEFINE_ACRONYM_SHORTCUT_GLOBAL, error as Error)
      }
    },
  )

  app.shortcut(
    DEFINE_ACRONYM_SHORTCUT_MESSAGE,
    async ({ ack, shortcut, client, context }) => {
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

        const channelId = shortcut.channel.id
        const threadTs = shortcut.message.thread_ts

        const acronymMessage = await controller.acronym.defineAcronym({
          messageBlocks: shortcut.message.blocks,
          teamId,
          username: shortcut.user.name,
        })

        await saySilent(client, channelId, userId, acronymMessage, threadTs)
      } catch (error) {
        handleSlackError(error as Error, userId, client)
      }
    },
  )

  app.view(
    DEFINE_ACRONYM_CALLBACK_ID,
    async ({ ack, context, view, body, client }) => {
      try {
        const teamId = context.teamId

        if (!teamId) {
          throw new Error('invalid team id.')
        }

        const search =
          view.state.values[DEFINE_ACRONYM_INPUT_LABEL]?.[
            DEFINE_ACRONYM_INPUT_LABEL_ACTION
          ]?.value
        if (!search) {
          throw new Error('invalid search.')
        }

        const definition = await controller.acronym.defineAcronym({
          teamId,
          plainText: search,
          username: body.user.name,
        })

        await ack({
          response_action: 'update',
          view: {
            type: 'modal',
            title: {
              type: 'plain_text',
              text: 'Voila!',
            },
            blocks: [
              {
                type: 'section',
                text: {
                  type: 'mrkdwn',
                  text: definition ?? `Sorry I couldn't find anything 😞`,
                },
              },
            ],
          },
        })
      } catch (error) {
        handleSlackError(error as Error, body.user.id, client)
      }
    },
  )

  app.view(
    CREATE_ACRONYM_CALLBACK_ID,
    async ({ ack, context, view, body, client }) => {
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

        await controller.acronym.createAcronym({
          acronym,
          definition,
          teamId,
          userId: user.id,
          username: user.name,
        })
      } catch (error) {
        handleSlackError(error as Error, body.user.id, client)
      }
    },
  )
}
