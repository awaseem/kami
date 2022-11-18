import { Models } from '../models'
import { ControllerError } from '../utils/error'
import {
  Block,
  foundAcronymMessage,
  getFoundAcronyms,
  parseMessageBlocks,
} from '../utils/messages'

export interface CreateAcronymArgs {
  accessToken: string
  teamId: string
  acronym: string
  definition: string
  userId: string
  username: string
}

export interface DefineAcronymArgs {
  messageBlocks?: Block[]
  plainText?: string
  teamId: string
  accessToken: string
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

  async function defineAcronym({
    plainText,
    messageBlocks,
    teamId,
    accessToken,
  }: DefineAcronymArgs) {
    const message = plainText ?? parseMessageBlocks(messageBlocks)
    if (!message) {
      throw new ControllerError('Failed to parse blocks for messages')
    }

    const acronyms = getFoundAcronyms(message)
    if (!acronyms) {
      return undefined
    }

    const databaseId = await models.notion.getAcronymPageId(teamId)
    if (!databaseId) {
      throw new ControllerError('failed to find a page to store acronyms')
    }

    const foundAcronyms = await models.acronyms.queryAcronyms(
      accessToken,
      databaseId,
      acronyms,
    )
    if (foundAcronyms.length === 0) {
      return undefined
    }

    return foundAcronymMessage(foundAcronyms)
  }

  return Object.freeze({
    createAcronym,
    defineAcronym,
  })
}
