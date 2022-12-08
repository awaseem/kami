import type Stripe from 'stripe'
import { BillingModel, BillingSubscriptionObj } from '../models/billing'
import { ControllerError } from '../utils/error'
import { getAppHomeDeepLink } from '../utils/links'

export type BillingController = ReturnType<typeof createBillingController>

export interface BillingConfig {
  subscription?: BillingSubscriptionObj
  billingDescriptions?: string[]
  url: string
}

export function createBillingController(billingModel: BillingModel) {
  async function isValidBilling(teamId: string) {
    const subscriptions = await billingModel.getBillingSubscription(teamId)
    if (!subscriptions) {
      return false
    }

    return (
      subscriptions.status === 'active' || subscriptions.status === 'trialing'
    )
  }

  async function configureBilling(teamId: string) {
    const homeDeepLink = getAppHomeDeepLink(teamId)

    const subscription = await billingModel.getBillingSubscription(teamId)
    if (subscription) {
      const portalUrl = await billingModel.getBillingPortal(
        subscription.customerId,
        homeDeepLink,
      )
      const upcomingInvoice = await billingModel.getUpcomingInvoice(
        subscription.customerId,
      )
      const billingDescriptions = upcomingInvoice.lines.data
        .map((item) => item.description)
        .filter(Boolean) as string[]

      return {
        subscription,
        billingDescriptions,
        url: portalUrl,
      }
    }

    const url = await billingModel.createSubscription(
      teamId,
      homeDeepLink,
      homeDeepLink,
    )

    if (!url) {
      throw new ControllerError('No url found when configuring billing')
    }

    return {
      url,
    }
  }

  async function addAiUsage(teamId: string) {
    const subscription = await billingModel.getBillingSubscription(teamId)
    if (!subscription) {
      throw new ControllerError(
        `Failed to find subscription for team ${teamId}`,
      )
    }

    await billingModel.createUsageRecord(subscription.subscriptionItemId, 1)
  }

  async function handleStripeEvents(
    data: any,
    sig: string,
    endpointSecret: string,
  ) {
    const event = billingModel.getStripeEvent(data, sig, endpointSecret)

    const subscription = event.data.object as Stripe.Subscription
    const teamId = subscription.metadata.teamId
    if (!teamId) {
      throw new ControllerError(
        'Failed to find team ID when configuring billing',
      )
    }

    if (
      event.type === 'customer.subscription.created' ||
      event.type === 'customer.subscription.updated'
    ) {
      const customerId = subscription.customer as string
      const status = subscription.status
      const subscriptionId = subscription.id
      const subscriptionItemId = subscription.items.data?.[0].id

      await billingModel.setBillingSubscription(teamId, {
        customerId,
        status,
        subscriptionId,
        subscriptionItemId,
      })
      return
    }

    if (event.type === 'customer.subscription.deleted') {
      await billingModel.removeBillingSubscription(teamId)
      return
    }
  }

  return Object.freeze({
    configureBilling,
    handleStripeEvents,
    isValidBilling,
    addAiUsage,
  })
}
