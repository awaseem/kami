import { App } from '@slack/bolt'
import { createModels } from '../models'
import { createRouter } from '../routes'
import { getSlackSigningSecret, getSlackToken } from '../utils/env'
import { createAppHomeHandlers } from './appHome'
import { createShortcutHandlers } from './shortcuts'

export function createSlackApp() {
  const models = createModels()
  const receiver = createRouter(models)

  const app = new App({
    token: getSlackToken(),
    signingSecret: getSlackSigningSecret(),
    receiver,
  })

  // Register handlers
  createAppHomeHandlers(app, models)
  createShortcutHandlers(app, models)

  return app
}
