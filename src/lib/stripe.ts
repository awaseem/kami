import Stripe from 'stripe'
import { ENV_stripeKey } from '../utils/env'

function createStripeClient() {
  return new Stripe(ENV_stripeKey, {
    apiVersion: '2022-11-15',
    httpClient: Stripe.createFetchHttpClient(),
  })
}

const stripe = createStripeClient()
export default stripe
