import { Models } from '../models'
import { ControllerError } from '../utils/error'

export enum AuthState {
  INVALID,
  ACCESS_TOKEN_ONLY,
  VALID,
}

export function createAuthController(models: Models) {
  async function isValid(teamId: string) {
    const accessToken =
      await models.accessTokens.notionAccessTokenStore.getAccessToken(teamId)
    return Boolean(accessToken)
  }

  async function getAccessToken(teamId: string) {
    const token =
      await models.accessTokens.notionAccessTokenStore.getAccessToken(teamId)
    if (!token) {
      throw new ControllerError('Unable to find access token for validation')
    }

    return token
  }

  return Object.freeze({ isValid, getAccessToken })
}
