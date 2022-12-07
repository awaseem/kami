import { Models } from '../models'
import { createAcronymControllers } from './acronym'
import { createAuthController } from './auth'
import { createBillingController } from './billing'
import { createFaqControllers } from './faq'
import { createPageControllers } from './page'

export type Controllers = ReturnType<typeof createControllers>

export function createControllers(models: Models) {
  return Object.freeze({
    acronym: createAcronymControllers(models),
    page: createPageControllers(models),
    faq: createFaqControllers(models),
    auth: createAuthController(
      models.notion,
      models.accessTokens,
      models.slack,
    ),
    billing: createBillingController(models.billing),
  })
}
