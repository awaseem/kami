import { createRedisStore } from './store'

const notionAccessTokenStore = createRedisStore('notion|access|tokens')

async function isValidNotionInstall(teamId: string): Promise<boolean> {
  const accessToken = await notionAccessTokenStore.get(teamId)
  return Boolean(accessToken)
}

async function getAccessToken(teamId: string) {
  return notionAccessTokenStore.get(teamId)
}

async function setAccessToken(teamId: string, accessToken: string) {
  await notionAccessTokenStore.set(teamId, accessToken)
}

export function createAccessTokensModel() {
  return Object.freeze({
    notionAccessTokenStore: {
      isValidNotionInstall,
      setAccessToken,
      getAccessToken,
    },
  })
}
