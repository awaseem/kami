import type { WebClient } from '@slack/web-api'

export const NOTION_AUTH_BUTTON_CLICKED = 'notion_auth_button_clicked'
export const NOTION_SETUP_PAGE_ID_BUTTON_CLICKED = 'notion_setup_page_id_button'

export const BILLING_BUTTON_CLICKED = 'billing_button_clicked'

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
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Please select a page that Kami can use to store information',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Select page',
              emoji: true,
            },
            action_id: NOTION_SETUP_PAGE_ID_BUTTON_CLICKED,
          },
        },
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Billing 💰',
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: 'Configure billing for Kami.',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Configure',
              emoji: true,
            },
            value: 'click_billing',
            action_id: BILLING_BUTTON_CLICKED,
          },
        },
      ],
    },
  })
}

export const SETUP_PAGE_CALLBACK_ID = 'setup_page_callback_id'
export const SETUP_PAGE_URL_INPUT = 'setup_page_url_input'
export const SETUP_PAGE_URL_INPUT_ACTION = 'setup_page_url_input_action'

export function createSetupPageModel(client: WebClient, triggerId: string) {
  return client.views.open({
    trigger_id: triggerId,
    view: {
      type: 'modal',
      callback_id: SETUP_PAGE_CALLBACK_ID,
      title: {
        type: 'plain_text',
        text: 'Select Page',
        emoji: true,
      },
      submit: {
        type: 'plain_text',
        text: 'Submit',
        emoji: true,
      },
      close: {
        type: 'plain_text',
        text: 'Cancel',
        emoji: true,
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: 'Paste a valid notion url from your workspace',
            emoji: true,
          },
        },
        {
          type: 'input',
          block_id: SETUP_PAGE_URL_INPUT,
          element: {
            type: 'plain_text_input',
            action_id: SETUP_PAGE_URL_INPUT_ACTION,
          },
          label: {
            type: 'plain_text',
            text: 'Notion page URL',
            emoji: true,
          },
        },
      ],
    },
  })
}
