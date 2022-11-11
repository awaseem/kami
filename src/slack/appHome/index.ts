import type { App } from '@slack/bolt'
import { Models } from '../../models'
import { logEventError } from '../../utils/logger'
import { getPageIdFromNotionUrl } from '../../utils/notion'
import { validNotionIntegration } from '../common'
import {
  createAppHome,
  createSetupPageModel,
  NOTION_AUTH_BUTTON_CLICKED,
  NOTION_SETUP_PAGE_ID_BUTTON_CLICKED,
  SETUP_PAGE_CALLBACK_ID,
  SETUP_PAGE_URL_INPUT,
  SETUP_PAGE_URL_INPUT_ACTION,
} from '../views/appHome'

const APP_HOME_OPEN_EVENT = 'app_home_opened'

export function createAppHomeHandlers(app: App, models: Models) {
  app.event(APP_HOME_OPEN_EVENT, async ({ context, client, event, logger }) => {
    try {
      const teamId = context.teamId
      if (!teamId) {
        throw new Error('failed to find team id when create app home')
      }

      const notionConnectUrl = models.notion.getNotionOauthUrl(teamId)

      await createAppHome(client, event.user, notionConnectUrl)
    } catch (error) {
      logEventError(logger, APP_HOME_OPEN_EVENT, error as Error)
    }
  })

  app.action(NOTION_AUTH_BUTTON_CLICKED, async ({ ack }) => {
    await ack()
  })

  app.action(
    NOTION_SETUP_PAGE_ID_BUTTON_CLICKED,
    async ({ ack, action, body, logger, context, client }) => {
      try {
        await ack()

        const teamId = context.teamId
        const triggerId =
          body.type === 'block_actions' ? body.trigger_id : undefined
        if (!triggerId || !teamId) {
          throw new Error('no valid trigger id or team id found.')
        }

        await validNotionIntegration({ models, teamId, triggerId, client })

        await createSetupPageModel(client, triggerId)
      } catch (error) {
        logEventError(
          logger,
          NOTION_SETUP_PAGE_ID_BUTTON_CLICKED,
          error as Error,
        )
      }
    },
  )

  app.view(SETUP_PAGE_CALLBACK_ID, async ({ ack, context, view, logger }) => {
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

      const accessToken =
        await models.accessTokens.notionAccessTokenStore.getAccessTokenOrThrow(
          teamId,
        )
      const page = await models.notion.getNotionPage(accessToken, pageId)
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
      await models.notion.saveRootPage(teamId, page.id)
      await models.notion.createAcronymDatabase(accessToken, teamId, page.id)
    } catch (error) {
      logEventError(logger, SETUP_PAGE_CALLBACK_ID, error as Error)
    }
  })
}
