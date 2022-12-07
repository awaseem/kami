import { BillingModel } from '../models/billing'
import { ControllerError } from '../utils/error'
import { getAppHomeDeepLink } from '../utils/links'

export type BillingController = ReturnType<typeof createBillingController>

export function createBillingController(billingModel: BillingModel) {
  async function configureBilling(teamId: string) {
    const homeDeepLink = getAppHomeDeepLink(teamId)
    const url = await billingModel.createSubscription(
      teamId,
      homeDeepLink,
      homeDeepLink,
    )

    if (!url) {
      throw new ControllerError('No url found when configuring billing')
    }

    return url
  }

  return Object.freeze({
    configureBilling,
  })
}
