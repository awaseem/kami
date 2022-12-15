import { Installation, InstallationQuery } from '@slack/bolt'
import { AccessTokenModel } from '../models/accessTokens'
import { NotionModel } from '../models/notion'
import { SlackModel } from '../models/slack'

export function createAuthController(
  notionModel: NotionModel,
  accessTokenModel: AccessTokenModel,
  slackModel: SlackModel,
) {
  function getNotionSetupUrl(teamId: string, userId: string) {
    return notionModel.getNotionOauthUrl(teamId, userId)
  }

  async function removeAllAppData(teamId: string) {
    await Promise.all([
      notionModel.removeAllPages(teamId),
      accessTokenModel.notion.removeAccessTokens(teamId),
    ])
  }

  async function hasNotionAccessToken(teamId: string) {
    const accessToken = await accessTokenModel.notion.getAccessToken(teamId)
    return Boolean(accessToken)
  }

  async function storeInstall(install: Installation) {
    if (install.isEnterpriseInstall && install.enterprise !== undefined) {
      await slackModel.setInstall(install.enterprise.id, install)
      return
    }
    if (install.team !== undefined) {
      await slackModel.setInstall(install.team.id, install)
      return
    }
    throw new Error('Failed saving installation data to installationStore')
  }

  async function getInstall(
    installQuery: InstallationQuery<boolean>,
  ): Promise<Installation> {
    if (
      installQuery.isEnterpriseInstall &&
      installQuery.enterpriseId !== undefined
    ) {
      return (await slackModel.getInstall(
        installQuery.enterpriseId,
      )) as Installation
    }
    if (installQuery.teamId !== undefined) {
      return (await slackModel.getInstall(installQuery.teamId)) as Installation
    }
    throw new Error('Failed fetching installation')
  }

  async function deleteInstall(installQuery: InstallationQuery<boolean>) {
    if (
      installQuery.isEnterpriseInstall &&
      installQuery.enterpriseId !== undefined
    ) {
      await slackModel.deleteInstall(installQuery.enterpriseId)
      return
    }
    if (installQuery.teamId !== undefined) {
      await slackModel.deleteInstall(installQuery.teamId)
      return
    }
    throw new Error('Failed to delete installation')
  }

  return Object.freeze({
    hasNotionAccessToken,
    getNotionSetupUrl,
    storeInstall,
    getInstall,
    deleteInstall,
    removeAllAppData,
  })
}
