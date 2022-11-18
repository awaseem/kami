import fetch from 'node-fetch'
import { createNotionClient } from '../lib/notion'
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

async function getRootPage(teamId: string) {
  return notionRootPageRedisStore.get(teamId)
}

async function saveRootPage(teamId: string, pageId: string) {
  await notionRootPageRedisStore.set(teamId, pageId)
}

async function getAcronymPageIdOrThrow(teamId: string) {
  const pageId = await notionAcronymStore.get(teamId)
  if (!pageId) {
    throw new Error('no page id found')
  }

  return pageId
}

async function getAcronymPageId(teamId: string) {
  return notionAcronymStore.get(teamId)
}

async function setAcronymPageId(teamId: string, pageId: string) {
  await notionAcronymStore.set(teamId, pageId)
}

export function createNotionModels() {
  return {
    oauthExchange,
    getNotionOauthUrl,
    getNotionPage,
    getRootPage,
    saveRootPage,
    getAcronymPageId,
    getAcronymPageIdOrThrow,
    setAcronymPageId,
  }
}
