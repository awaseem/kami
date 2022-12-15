import type { ExpressReceiver } from '@slack/bolt'
import bodyParser from 'body-parser'
import { CustomContext } from '../contexts'
import { BillingController } from '../controllers/billing'
import { ENV_stripeEndpointSecret } from '../utils/env'

export function createBillingRoute(
  receiver: ExpressReceiver,
  billingController: BillingController,
  context: CustomContext,
) {
  receiver.router.post(
    '/billing/webhook',
    bodyParser.raw({ type: 'application/json' }),
    async (req, res) => {
      const sig = req.headers['stripe-signature'] as string
      const event = req.body
      const endpointSecret = ENV_stripeEndpointSecret

      try {
        await billingController.handleStripeEvents(
          event,
          sig,
          endpointSecret,
          context.chat,
        )
        res.status(201).send()
      } catch (err) {
        const errorMessage = (err as Error).message
        res.status(400).send(`Webhook Error: ${errorMessage}`)
        return
      }
    },
  )
}
