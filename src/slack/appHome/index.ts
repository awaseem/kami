import type { App } from '@slack/bolt'
import { Models } from '../../models'

const APP_HOME_OPEN_EVENT = 'app_home_opened'
const NOTION_BUTTON_CLICKED = 'notion_button_clicked'

export function createAppHomeHandlers(app: App, models: Models) {
  app.event(APP_HOME_OPEN_EVENT, async ({ context, client, event }) => {
    try {
      const teamId = context.teamId
      if (!teamId) {
        throw new Error('failed to find team id when create app home')
      }

      const notionConnectUrl = models.notion.getNotionOauthUrl(teamId)

      await client.views.publish({
        user_id: event.user,
        view: {
          type: 'home',
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: 'Hello 👋',
                emoji: true,
              },
            },
            {
              type: 'section',
              text: {
                type: 'plain_text',
                text: `Welcome to Kami. We aspire to keep information out of the deep abyss of Slack.`,
                emoji: true,
              },
            },
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: 'Integration 🔌',
                emoji: true,
              },
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: 'Please continue the integration with notion before continuing. ****',
              },
              accessory: {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Connect Notion',
                  emoji: true,
                },
                value: 'click_notion',
                url: notionConnectUrl,
                action_id: NOTION_BUTTON_CLICKED,
              },
            },
          ],
        },
      })
    } catch (error) {
      console.log('Error trying to load app home', error)
    }
  })

  app.action(NOTION_BUTTON_CLICKED, async ({ ack }) => {
    await ack()
  })
}
