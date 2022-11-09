import { createRedisStore } from './store'

const notionAccessTokenStore = createRedisStore('notion|access|tokens')

async function isValidNotionInstall(teamId: string): Promise<boolean> {
  const accessToken = await notionAccessTokenStore.get(teamId)
  return Boolean(accessToken)
}

export function createAccessTokensModel() {
  return Object.freeze({
    notionAccessTokenStore: {
      ...notionAccessTokenStore,
      isValidNotionInstall,
    },
  })
}
