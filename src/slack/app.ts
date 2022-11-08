import { App } from '@slack/bolt'
import { createRouter } from '../routes'
import { getSlackSigningSecret, getSlackToken } from '../utils/env'
import { createAppHomeHandlers } from './appHome'

export function createSlackApp() {
  const receiver = createRouter()

  const app = new App({
    token: getSlackToken(),
    signingSecret: getSlackSigningSecret(),
    receiver,
  })

  // Register handlers
  createAppHomeHandlers(app)

  return app
}
