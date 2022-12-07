import type { App } from '@slack/bolt'
import { Controllers } from '../../controllers'
import { handleSlackError } from '../../utils/error'
import { logEventError } from '../../utils/logger'
import { getPageIdFromNotionUrl } from '../../utils/notion'
import {
  BILLING_BUTTON_CLICKED,
  createAppHome,
  createSetupPageModel,
  NOTION_AUTH_BUTTON_CLICKED,
  NOTION_SETUP_PAGE_ID_BUTTON_CLICKED,
  SETUP_PAGE_CALLBACK_ID,
  SETUP_PAGE_URL_INPUT,
  SETUP_PAGE_URL_INPUT_ACTION,
} from '../views/appHome'
import { ErrorModel } from '../views/error'

const APP_HOME_OPEN_EVENT = 'app_home_opened'

export function createAppHomeHandlers(app: App, controllers: Controllers) {
  app.event(APP_HOME_OPEN_EVENT, async ({ context, client, event }) => {
    try {
      const teamId = context.teamId
      if (!teamId) {
        throw new Error('failed to find team id when create app home')
      }

      const notionConnectUrl = controllers.auth.getNotionSetupUrl(teamId)
      await createAppHome(client, event.user, notionConnectUrl)
    } catch (error) {
      logEventError(APP_HOME_OPEN_EVENT, error as Error)
    }
  })

  app.action(NOTION_AUTH_BUTTON_CLICKED, async ({ ack }) => {
    await ack()
  })

  app.action(BILLING_BUTTON_CLICKED, async ({ ack, context }) => {
    await ack()

    // TODO open modal to create billing
    const teamId = context.teamId
    if (!teamId) {
      return
    }

    const url = await controllers.billing.configureBilling(teamId)
    console.log(url)
  })

  app.action(
    NOTION_SETUP_PAGE_ID_BUTTON_CLICKED,
    async ({ ack, body, context, client }) => {
      try {
        await ack()

        const teamId = context.teamId
        const triggerId =
          body.type === 'block_actions' ? body.trigger_id : undefined
        if (!triggerId || !teamId) {
          throw new Error('no valid trigger id or team id found.')
        }

        const hasAccessToken = await controllers.auth.hasNotionAccessToken(
          teamId,
        )
        if (!hasAccessToken) {
          await ErrorModel(
            client,
            triggerId,
            `Your integration to notion has not been setup. Please connect with notion before selecting a root page.`,
          )
          return
        }

        await createSetupPageModel(client, triggerId)
      } catch (error) {
        logEventError(NOTION_SETUP_PAGE_ID_BUTTON_CLICKED, error as Error)
      }
    },
  )

  app.view(
    SETUP_PAGE_CALLBACK_ID,
    async ({ ack, context, view, body, client }) => {
      try {
        const teamId = context.teamId
        if (!teamId) {
          throw new Error('invalid team id.')
        }

        const url =
          view.state.values[SETUP_PAGE_URL_INPUT]?.[SETUP_PAGE_URL_INPUT_ACTION]
            ?.value

        if (!url) {
          await ack({
            response_action: 'errors',
            errors: {
              [SETUP_PAGE_URL_INPUT]: 'Please enter a url',
            },
          })
          return
        }

        const pageId = getPageIdFromNotionUrl(url)
        if (!pageId) {
          await ack({
            response_action: 'errors',
            errors: {
              [SETUP_PAGE_URL_INPUT]:
                'No page id found, please make sure you have a valid notion page url',
            },
          })
          return
        }

        const page = await controllers.page.doesPageExist(teamId, pageId)
        if (!page) {
          await ack({
            response_action: 'errors',
            errors: {
              [SETUP_PAGE_URL_INPUT]:
                'No page found, please ensure that Kami has access to this page and it is in your workspace',
            },
          })
          return
        }

        await ack()
        await controllers.page.createRootAndPages(teamId, page.id)
      } catch (error) {
        handleSlackError(error as Error, body.user.id, client)
      }
    },
  )
}
