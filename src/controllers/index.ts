import { Models } from '../models'
import { createAcronymControllers } from './acronym'
import { createAuthController } from './auth'

export type Controllers = ReturnType<typeof createControllers>

export function createControllers(models: Models) {
  return Object.freeze({
    acronym: createAcronymControllers(models),
    auth: createAuthController(models),
  })
}
