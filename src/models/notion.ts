import fetch from 'node-fetch'
import { createNotionClient } from '../lib/notion'
import {
  ENV_notionAuthUrl,
  ENV_notionRedirectUrl,
  getNotionBasicAuth,
} from '../utils/env'
import { NotionError } from '../utils/error'
import { logError } from '../utils/logger'
import { createRedisStore } from './store'

const NOTION_AUTH_EXCHANGE_ROUTE = 'https://api.notion.com/v1/oauth/token'

const notionRootPageRedisStore = createRedisStore('notion|root|page')
const notionAcronymStore = createRedisStore('notion|acronym|page')
const notionFaqStore = createRedisStore('notion|faq|page')

async function oauthExchange(code: string) {
  const body = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: ENV_notionRedirectUrl,
  }

  const response = await fetch(NOTION_AUTH_EXCHANGE_ROUTE, {
    method: 'POST',
    headers: {
      Authorization: getNotionBasicAuth(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = (await response.json()) as { access_token: string }

  return data.access_token
}

function getNotionOauthUrl(teamId: string) {
  const baseUrl = ENV_notionAuthUrl
  const redirectUri = ENV_notionRedirectUrl

  return `${baseUrl}&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&state=${teamId}`
}

async function getNotionPage(accessToken: string, pageId: string) {
  try {
    const notion = createNotionClient(accessToken)

    return await notion.pages.retrieve({ page_id: pageId })
  } catch (error) {
    logError(error as Error)
    return undefined
  }
}

async function getRootPage(teamId: string) {
  return notionRootPageRedisStore.get(teamId)
}

async function saveRootPage(teamId: string, pageId: string) {
  await notionRootPageRedisStore.set(teamId, pageId)
}

async function getAcronymPageId(teamId: string) {
  return notionAcronymStore.get(teamId)
}

async function setAcronymPageId(teamId: string, pageId: string) {
  await notionAcronymStore.set(teamId, pageId)
}

async function getFaqPageId(teamId: string) {
  return notionFaqStore.get(teamId)
}

async function setFaqPageId(teamId: string, pageId: string) {
  await notionFaqStore.set(teamId, pageId)
}

async function createRootPage(accessToken: string, parentId: string) {
  try {
    const notion = createNotionClient(accessToken)

    const response = await notion.pages.create({
      parent: {
        type: 'page_id',
        page_id: parentId,
      },
      icon: { type: 'emoji', emoji: '🔮' },
      properties: {
        title: {
          title: [
            {
              text: {
                content: 'Kami',
              },
            },
          ],
        },
      },
      children: [
        {
          object: 'block',
          paragraph: {
            rich_text: [
              {
                text: {
                  content:
                    'Welcome to Kami 👋. We aim to make it our mission to keep information away from Slack.',
                },
              },
            ],
            color: 'default',
          },
        },
        {
          object: 'block',
          heading_1: {
            rich_text: [
              {
                text: {
                  content: 'What is this?',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          paragraph: {
            rich_text: [
              {
                text: {
                  content:
                    'This is where Kami stores all information with the integration with Slack. Please do not delete this page, if you wish to move it to another parent, please ensure that page has access to Kami.',
                },
              },
            ],
            color: 'default',
          },
        },
        {
          object: 'block',
          heading_1: {
            rich_text: [
              {
                text: {
                  content: 'Saved Content',
                },
              },
            ],
          },
        },
      ],
    })

    return response
  } catch (error) {
    throw new NotionError(error as Error)
  }
}

export function createNotionModels() {
  return {
    oauthExchange,
    getNotionOauthUrl,
    getNotionPage,
    getRootPage,
    saveRootPage,
    getAcronymPageId,
    setAcronymPageId,
    getFaqPageId,
    setFaqPageId,
    createRootPage,
  }
}

export type NotionModel = ReturnType<typeof createNotionModels>
