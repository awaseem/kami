import type { ExpressReceiver } from '@slack/bolt'
import { BillingController } from '../controllers/billing'

export function createBillingRoute(
  receiver: ExpressReceiver,
  billingController: BillingController,
) {
  return
}
