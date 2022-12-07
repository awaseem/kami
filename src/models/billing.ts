import type Stripe from 'stripe'
import stripe from '../lib/stripe'
import { ENV_hostname, ENV_stripePricing } from '../utils/env'
import { createRedisStore } from './store'

export type BillingModel = ReturnType<typeof createBillingModel>

export interface BillingSubscriptionObj {
  subscriptionId: string
  customerId: string
  status: Stripe.Subscription.Status
}

const billingStore = createRedisStore('billing|subscription')

async function createSubscription(
  teamId: string,
  successUrl: string,
  cancelUrl: string,
) {
  const hostName = ENV_hostname

  const metadata = {
    teamId,
  }

  const { url } = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [
      {
        price: ENV_stripePricing,
      },
    ],
    success_url: hostName + successUrl,
    cancel_url: hostName + cancelUrl,
    metadata,
    subscription_data: {
      metadata,
    },
  })

  if (!url) {
    return undefined
  }

  return url
}

async function getBillingPortal(stripeCustomerId: string, returnUrl: string) {
  const hostName = ENV_hostname

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: hostName + returnUrl,
  })

  return portalSession.url
}

async function setBillingSubscription(
  teamId: string,
  billingObj: BillingSubscriptionObj,
) {
  await billingStore.setObj(teamId, billingObj)
}

async function getBillingSubscription(
  teamId: string,
): Promise<BillingSubscriptionObj | undefined> {
  return billingStore.getObj(teamId)
}

async function removeBillingSubscription(teamId: string) {
  await billingStore.remove(teamId)
}

function getStripeEvent(data: any, sig: string, endpointSecret: string) {
  return stripe.webhooks.constructEvent(data, sig, endpointSecret)
}

export function createBillingModel() {
  return Object.freeze({
    createSubscription,
    getBillingPortal,
    getStripeEvent,
    setBillingSubscription,
    getBillingSubscription,
    removeBillingSubscription,
  })
}
