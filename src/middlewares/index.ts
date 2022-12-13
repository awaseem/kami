import type { App } from '@slack/bolt'
import { BillingController } from '../controllers/billing'
import { BillingError, handleSlackError } from '../utils/error'

export type Middlewares = ReturnType<typeof createMiddlewares>

export function createMiddlewares(billingController: BillingController) {
  async function billingMiddleware({
    body,
    client,
    context,
    next,
    ack,
    message,
  }: any) {
    // This middleware responds to all events, so we need to find user IDs in any event
    const userId = (body?.user?.id ?? message?.user) as string | undefined
    if (!userId) {
      return
    }

    try {
      const teamId = context.teamId
      if (!teamId) {
        const error = new Error('Failed to find team id')
        throw new BillingError(error)
      }

      const billingValid = await billingController.isValidBilling(teamId)
      if (!billingValid) {
        const error = new Error(`Billing is not valid for team: ${teamId}`)
        throw new BillingError(error)
      }
    } catch (error) {
      if (ack) {
        await ack()
      }
      await handleSlackError(error as Error, userId, client)
      return
    }

    await next()
  }

  return Object.freeze({
    billingMiddleware,
  })
}
