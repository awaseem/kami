import { App } from '@slack/bolt'
import { createControllers } from '../controllers'
import { createModels } from '../models'
import { createRouter } from '../routes'
import { createAppHomeHandlers } from './appHome'
import { createAcronymHandlers } from './acronyms'
import { createFaqHandlers } from './faq'
import { createPageHandlers } from './page'

export function createSlackApp() {
  const models = createModels()
  const controllers = createControllers(models)

  const receiver = createRouter(models, controllers)
  const app = new App({
    receiver,
  })

  // Register handlers
  createAppHomeHandlers(app, controllers)
  createAcronymHandlers(app, controllers)
  createFaqHandlers(app, controllers)
  createPageHandlers(app, controllers)

  return app
}
