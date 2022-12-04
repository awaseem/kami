import { App } from '@slack/bolt'
import { createControllers } from '../controllers'
import { createModels } from '../models'
import { createRouter } from '../routes'
import { ENV_slackSigningSecret, ENV_slackToken } from '../utils/env'
import { createAppHomeHandlers } from './appHome'
import { createAcronymHandlers } from './acronyms'
import { createFaqHandlers } from './faq'
import { createPageHandlers } from './page'

export function createSlackApp() {
  const models = createModels()
  const controllers = createControllers(models)
  const receiver = createRouter(models)

  const app = new App({
    token: ENV_slackToken,
    signingSecret: ENV_slackSigningSecret,
    receiver,
  })

  // Register handlers
  createAppHomeHandlers(app, controllers)
  createAcronymHandlers(app, controllers)
  createFaqHandlers(app, controllers)
  createPageHandlers(app, controllers)

  return app
}
