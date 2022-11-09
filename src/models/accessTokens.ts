import { createRedisStore } from './store'

export function createAccessTokensModel() {
  const notionAccessTokenStore = createRedisStore('notion|access|tokens')

  return Object.freeze({
    notionAccessTokenStore,
  })
}
