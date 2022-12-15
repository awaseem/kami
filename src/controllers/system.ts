import { Models } from '../models'

export interface SystemStatus {
  notionStatus: boolean
  rootPageStatus: boolean
  billingStatus: boolean
}

export function createSystemController(models: Models) {
  async function getSystemStatus(teamId: string): Promise<SystemStatus> {
    const [accessToken, rootPage, billingSubscription] = await Promise.all([
      models.accessTokens.notion.getAccessToken(teamId),
      models.notion.getRootPage(teamId),
      models.billing.getBillingSubscription(teamId),
    ])

    return {
      notionStatus: Boolean(accessToken),
      rootPageStatus: Boolean(rootPage),
      billingStatus: Boolean(billingSubscription),
    }
  }

  return Object.freeze({
    getSystemStatus,
  })
}
