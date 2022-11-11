import { Client, LogLevel } from '@notionhq/client'
import fetch from 'node-fetch'
import {
  getNotionAuthUrl,
  getNotionBasicAuth,
  getNotionRedirectUrl,
} from '../utils/env'
import { logError } from '../utils/logger'
import { createRedisStore } from './store'

const NOTION_AUTH_EXCHANGE_ROUTE = 'https://api.notion.com/v1/oauth/token'

const notionRootPageRedisStore = createRedisStore('notion|root|page')
const notionAcronymStore = createRedisStore('notion|acronym|page')

function createNotionClient(accessToken: string) {
  return new Client({
    auth: accessToken,
    logLevel:
      process.env.NODE_ENV === 'production' ? LogLevel.DEBUG : undefined,
  })
}

async function oauthExchange(code: string) {
  const body = {
    grant_type: 'authorization_code',
    code,
    redirect_uri: getNotionRedirectUrl(),
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
  const baseUrl = getNotionAuthUrl()
  const redirectUri = getNotionRedirectUrl()

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

async function saveRootPage(teamId: string, pageId: string) {
  await notionRootPageRedisStore.set(teamId, pageId)
}

async function createAcronymDatabase(
  accessToken: string,
  teamId: string,
  parentId: string,
) {
  try {
    const notion = createNotionClient(accessToken)

    const response = await notion.databases.create({
      parent: {
        page_id: parentId,
      },
      icon: { emoji: '📕' },
      title: [
        {
          type: 'text',
          text: {
            content: 'Acronym List',
            link: null,
          },
        },
      ],
      description: [
        {
          type: 'text',
          text: {
            content: 'All the acronyms Kami stores and uses.',
            link: null,
          },
        },
      ],
      properties: {
        Acronym: {
          type: 'title',
          title: {},
        },
        Definition: {
          type: 'rich_text',
          rich_text: {},
        },
        ['Add by (Slack ID)']: {
          type: 'url',
          url: {},
        },
        ['Created at']: {
          type: 'created_time',
          created_time: {},
        },
        ['Last edited']: {
          type: 'last_edited_time',
          last_edited_time: {},
        },
      },
    })

    await notionAcronymStore.set(teamId, response.id)
  } catch (error) {
    logError(error as Error)
  }
}

export async function getAcronymPageId(teamId: string) {
  return notionAcronymStore.get(teamId)
}

export function createNotionModels() {
  return {
    oauthExchange,
    getNotionOauthUrl,
    getNotionPage,
    saveRootPage,
    createAcronymDatabase,
    getAcronymPageId,
  }
}
