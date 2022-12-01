import { ExpressReceiver } from '@slack/bolt'
import { Models } from '../models'
import { ENV_slackSigningSecret } from '../utils/env'
import { createNotionAuthRoute } from './notion/auth'

export function createRouter(models: Models) {
  const receiver = new ExpressReceiver({
    signingSecret: ENV_slackSigningSecret,
  })

  // Register routes
  createNotionAuthRoute(receiver, models)

  return receiver
}
