import { Models } from '../models'
import { ControllerError } from '../utils/error'

export interface CreateAcronymArgs {
  accessToken: string
  teamId: string
  acronym: string
  definition: string
  userId: string
  username: string
}

export function createAcronymControllers(models: Models) {
  async function createAcronym({
    accessToken,
    teamId,
    userId,
    username,
    acronym,
    definition,
  }: CreateAcronymArgs) {
    const databaseId = await models.notion.getAcronymPageId(teamId)
    if (!databaseId) {
      throw new ControllerError('failed to find a page to store acronyms')
    }

    await models.acronyms.createAcronym({
      accessToken,
      databaseId,
      acronym,
      definition,
      userId: userId,
      username: username,
    })
  }

  return Object.freeze({
    createAcronym,
  })
}
