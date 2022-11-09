import { ExpressReceiver } from '@slack/bolt'
import { Models } from '../models'
import { getSlackSigningSecret } from '../utils/env'
import { createNotionAuthRoute } from './notion/auth'

export function createRouter(models: Models) {
  const receiver = new ExpressReceiver({
    signingSecret: getSlackSigningSecret(),
  })

  // Register routes
  createNotionAuthRoute(receiver, models)

  return receiver
}
