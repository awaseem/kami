import { App } from '@slack/bolt'
import { createControllers } from '../controllers'
import { createModels } from '../models'
import { createRouter } from '../routes'
import { createAppHomeHandlers } from './appHome'
import { createAcronymHandlers } from './acronyms'
import { createFaqHandlers } from './faq'
import { createPageHandlers } from './page'
import { createMiddlewares } from '../middlewares'

export function createSlackApp() {
  const models = createModels()
  const controllers = createControllers(models)

  const receiver = createRouter(models, controllers)
  const app = new App({
    receiver,
  })

  const middlewares = createMiddlewares(app, controllers.billing)

  // Register app home and settings
  createAppHomeHandlers(app, controllers)

  // Register paid features
  createAcronymHandlers(app, middlewares, controllers)
  createFaqHandlers(app, middlewares, controllers)
  createPageHandlers(app, middlewares, controllers)

  return app
}
