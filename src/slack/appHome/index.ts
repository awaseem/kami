import type { App } from '@slack/bolt'
import { Models } from '../../models'
import { logEventError } from '../../utils/logger'
import { createAppHome, NOTION_AUTH_BUTTON_CLICKED } from '../views/appHome'

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
}
