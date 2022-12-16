import { ENV_notionSecretToken } from '../utils/env'
import { createRedisStore } from './store'

const notionAccessTokenStore = createRedisStore('notion|access|tokens')

async function getAccessToken(teamId: string) {
  if (ENV_notionSecretToken) {
    return ENV_notionSecretToken
  }

  return notionAccessTokenStore.get(teamId)
}

async function setAccessToken(teamId: string, accessToken: string) {
  if (ENV_notionSecretToken) {
    return
  }

  await notionAccessTokenStore.set(teamId, accessToken)
}

async function removeAccessTokens(teamId: string) {
  if (ENV_notionSecretToken) {
    return
  }

  await notionAccessTokenStore.remove(teamId)
}

export function createAccessTokensModel() {
  return Object.freeze({
    notion: {
      setAccessToken,
      getAccessToken,
      removeAccessTokens,
    },
  })
}

export type AccessTokenModel = ReturnType<typeof createAccessTokensModel>
