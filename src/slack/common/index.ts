import type { Models } from '../../models'
import { WebClient } from '@slack/web-api'
import { getAppHomeDeepLink } from '../../utils/links'
import { ErrorModel } from '../views/error'

export interface ValidNotionIntegrationArgs {
  models: Models
  teamId: string
  client: WebClient
  triggerId: string
}

export async function validNotionIntegration({
  models,
  teamId,
  client,
  triggerId,
}: ValidNotionIntegrationArgs) {
  const validIntegration =
    await models.accessTokens.notionAccessTokenStore.isValidNotionInstall(
      teamId,
    )

  if (!validIntegration) {
    await ErrorModel(
      client,
      triggerId,
      `Your integration to notion has not been setup. Please configure within the app home <${getAppHomeDeepLink(
        teamId,
      )}}|here>`,
    )
  }
}
