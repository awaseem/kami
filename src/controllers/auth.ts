import { AccessTokenModel } from '../models/accessTokens'
import { NotionModel } from '../models/notion'

export function createAuthController(
  notionModel: NotionModel,
  accessTokenModel: AccessTokenModel,
) {
  function getNotionSetupUrl(teamId: string) {
    return notionModel.getNotionOauthUrl(teamId)
  }

  async function hasNotionAccessToken(teamId: string) {
    const accessToken = await accessTokenModel.notion.getAccessToken(teamId)
    return Boolean(accessToken)
  }

  return Object.freeze({
    hasNotionAccessToken,
    getNotionSetupUrl,
  })
}
