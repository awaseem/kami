import type { WebClient } from '@slack/web-api'

export const NOTION_AUTH_BUTTON_CLICKED = 'notion_auth_button_clicked'

export async function createAppHome(
  client: WebClient,
  userId: string,
  notionConnectUrl: string,
) {
  return await client.views.publish({
    user_id: userId,
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
            text: 'Please continue the integration with notion before continuing.',
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
            action_id: NOTION_AUTH_BUTTON_CLICKED,
          },
        },
      ],
    },
  })
}
