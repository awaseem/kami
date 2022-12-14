import type { WebClient } from '@slack/web-api'
import type { BillingConfig } from '../../controllers/billing'
import { SystemStatus } from '../../controllers/system'
import {
  ENV_disableStripeBilling,
  ENV_notionSecretToken,
} from '../../utils/env'
import { getNotionPageUrl } from '../../utils/links'
import { genBooleanEmoji } from '../../utils/messages'

export const NOTION_AUTH_BUTTON_CLICKED = 'notion_auth_button_clicked'
export const NOTION_SETUP_PAGE_ID_BUTTON_CLICKED = 'notion_setup_page_id_button'

export const BILLING_BUTTON_CLICKED = 'billing_button_clicked'

export interface CreateAppHomeArgs {
  client: WebClient
  userId: string
  notionConnectUrl: string
  systemStatus: SystemStatus
}

export async function createAppHome({
  client,
  userId,
  notionConnectUrl,
  systemStatus,
}: CreateAppHomeArgs) {
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
          type: 'divider',
        },
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'System status 🤖',
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Notion integration: ${genBooleanEmoji(
              systemStatus.notionStatus,
            )}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Notion page selected: ${genBooleanEmoji(
              systemStatus.rootPageStatus,
            )}`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Billing configured: ${genBooleanEmoji(
              systemStatus.billingStatus,
            )}`,
          },
        },
        {
          type: 'divider',
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
            text: ENV_notionSecretToken
              ? 'Notion client is configured through environment variable `NOTION_SECRET_TOKEN`'
              : 'Please continue the integration with notion before continuing.',
          },

          ...(!ENV_notionSecretToken && {
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
          }),
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
          type: 'divider',
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
            text: ENV_disableStripeBilling
              ? 'Billing has been disabled'
              : 'Configure billing for Kami.',
          },

          ...(!ENV_disableStripeBilling && {
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
          }),
        },
      ],
    },
  })
}

export const SETUP_PAGE_CALLBACK_ID = 'setup_page_callback_id'
export const SETUP_PAGE_URL_INPUT = 'setup_page_url_input'
export const SETUP_PAGE_URL_INPUT_ACTION = 'setup_page_url_input_action'

export function createSetupPageModel(
  client: WebClient,
  triggerId: string,
  rootPageId?: string,
) {
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
            type: 'mrkdwn',
            text: `Paste a valid notion url from your workspace, we will generate all pages under thats space.\n\n*Current root page url:* <${
              rootPageId ? getNotionPageUrl(rootPageId) : 'N/A'
            }>`,
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
          },
        },
      ],
    },
  })
}

export const BILLING_CALLBACK_ID = 'billing_callback_id'
export const CONFIGURE_BILLING_BUTTON_CLICKED = 'billing_button_clicked'

export function createBillingViewModel(
  client: WebClient,
  triggerId: string,
  { url, subscription, billingDescriptions }: BillingConfig,
) {
  const billingDescriptionLines = billingDescriptions?.join('\n\n')

  return client.views.open({
    trigger_id: triggerId,
    view: {
      type: 'modal',
      callback_id: BILLING_CALLBACK_ID,
      title: {
        type: 'plain_text',
        text: 'Configure Billing',
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Configure billing for Kami`,
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Configure',
              emoji: true,
            },
            value: 'click_notion',
            url,
            action_id: CONFIGURE_BILLING_BUTTON_CLICKED,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Status: ${subscription?.status ?? 'incomplete'}* ${
              subscription?.status === 'active' ? '✅' : '😞'
            }`,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${
              billingDescriptionLines
                ? `*Billing Usage:*\n\n${billingDescriptionLines}`
                : undefined
            }`,
          },
        },
      ],
    },
  })
}
