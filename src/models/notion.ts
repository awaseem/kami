import fetch from 'node-fetch'
import {
  getNotionAuthUrl,
  getNotionBasicAuth,
  getNotionRedirectUrl,
} from '../utils/env'

const NOTION_AUTH_EXCHANGE_ROUTE = 'https://api.notion.com/v1/oauth/token'

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

export function createNotionModels() {
  return {
    oauthExchange,
    getNotionOauthUrl,
  }
}
