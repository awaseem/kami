import { createRedisStore } from './store'

const notionAccessTokenStore = createRedisStore('notion|access|tokens')

async function isValidNotionInstall(teamId: string): Promise<boolean> {
  const accessToken = await notionAccessTokenStore.get(teamId)
  return Boolean(accessToken)
}

async function getAccessTokenOrThrow(teamId: string): Promise<string> {
  const accessToken = await notionAccessTokenStore.get(teamId)
  if (!accessToken) {
    throw new Error('No access token found!')
  }

  return accessToken
}

export function createAccessTokensModel() {
  return Object.freeze({
    notionAccessTokenStore: {
      isValidNotionInstall,
      getAccessTokenOrThrow,
    },
  })
}
