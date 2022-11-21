import { Models } from '../models'
import { createAcronymControllers } from './acronym'
import { createFaqControllers } from './faq'
import { createPageControllers } from './page'

export type Controllers = ReturnType<typeof createControllers>

export function createControllers(models: Models) {
  return Object.freeze({
    acronym: createAcronymControllers(models),
    page: createPageControllers(models),
    faq: createFaqControllers(models),
  })
}
