import type { App } from '@slack/bolt'

const APP_HOME_OPEN_EVENT = 'app_home_opened'

export function createAppHomeHandlers(app: App) {
  app.event(APP_HOME_OPEN_EVENT, async ({ context, client, event }) => {
    try {
      const result = await client.views.publish({
        user_id: event.user,
        view: {
          type: 'home',
          blocks: [
            {
              type: 'header',
              text: {
                type: 'plain_text',
                text: 'Welcome 👋',
                emoji: true,
              },
            },
            {
              type: 'section',
              text: {
                type: 'plain_text',
                text: `Welcome to Kami 👋 We aspire to keep information out of the deep abyss of Slack.`,
                emoji: true,
              },
            },
          ],
        },
      })
    } catch (error) {
      console.log('Error trying to load app home', error)
    }
  })
}
