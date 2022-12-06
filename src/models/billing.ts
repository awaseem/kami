import stripe from '../lib/stripe'
import { ENV_hostname } from '../utils/env'

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
        price: 'price_1MBrs4Kgh6ysjn61GoO3QZKL',
        quantity: 1,
      },
    ],
    subscription_data: {
      trial_period_days: 7,
      metadata,
    },
    success_url: hostName + successUrl,
    cancel_url: hostName + cancelUrl,
    metadata,
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

export function createBillingModel() {
  return Object.freeze({
    createSubscription,
    getBillingPortal,
  })
}
