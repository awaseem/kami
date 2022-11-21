import { App } from '@slack/bolt'
import { createControllers } from '../controllers'
import { createModels } from '../models'
import { createRouter } from '../routes'
import { getSlackSigningSecret, getSlackToken } from '../utils/env'
import { createAppHomeHandlers } from './appHome'
import { createAcronymHandlers } from './acronyms'
import { createFaqHandlers } from './faq'

export function createSlackApp() {
  const models = createModels()
  const controllers = createControllers(models)
  const receiver = createRouter(models)

  const app = new App({
    token: getSlackToken(),
    signingSecret: getSlackSigningSecret(),
    receiver,
  })

  // Register handlers
  createAppHomeHandlers(app, models, controllers)
  createAcronymHandlers(app, controllers)
  createFaqHandlers(app, controllers)

  return app
}
