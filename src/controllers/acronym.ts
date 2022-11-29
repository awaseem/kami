import { Models } from '../models'
import { ControllerError, UserViewError } from '../utils/error'
import {
  Block,
  foundAcronymMessage,
  getFoundAcronyms,
  parseMessageBlocks,
} from '../utils/messages'
import { databaseResponseToAcronyms } from '../utils/notion'

export interface CreateAcronymArgs {
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
  username: string
}

export function createAcronymControllers(models: Models) {
  async function createAcronym({
    teamId,
    userId,
    username,
    acronym,
    definition,
  }: CreateAcronymArgs) {
    const accessToken =
      await models.accessTokens.notionAccessTokenStore.getAccessToken(teamId)
    if (!accessToken) {
      throw new ControllerError('no access token has been found')
    }

    const databaseId = await models.notion.getAcronymPageId(teamId)
    if (!databaseId) {
      throw new ControllerError('failed to find a page to store acronyms')
    }

    // Check to see if this acronym already exists or not
    const foundAcronymResponse = await models.acronyms.queryAcronyms(
      accessToken,
      databaseId,
      [acronym],
    )
    const foundAcronyms = databaseResponseToAcronyms(foundAcronymResponse)
    if (foundAcronyms.length !== 0) {
      const foundAcronymsMessage = foundAcronymMessage(foundAcronyms)
      throw new UserViewError(
        `This acronym already exists. ${foundAcronymsMessage}`,
      )
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
    username,
  }: DefineAcronymArgs) {
    const accessToken =
      await models.accessTokens.notionAccessTokenStore.getAccessToken(teamId)
    if (!accessToken) {
      throw new ControllerError('no access token has been found')
    }

    const message = plainText ?? parseMessageBlocks(messageBlocks)
    if (!message) {
      throw new ControllerError('Failed to parse blocks for messages')
    }

    const acronyms = getFoundAcronyms(message)
    if (!acronyms) {
      return 'Sorry no acronyms were found.'
    }

    const databaseId = await models.notion.getAcronymPageId(teamId)
    if (!databaseId) {
      throw new ControllerError('failed to find a page to store acronyms')
    }

    const foundAcronymsResponse = await models.acronyms.queryAcronyms(
      accessToken,
      databaseId,
      acronyms,
    )

    const foundAcronyms = databaseResponseToAcronyms(foundAcronymsResponse)
    if (foundAcronyms.length === 0) {
      return 'Sorry no acronyms were found.'
    }

    const foundAcronymsMessage = foundAcronymMessage(foundAcronyms)
    const quotedMessage = message
      ?.split('\n')
      ?.map((text) => `>${text}`)
      ?.join('\n')
    return `<@${username}> for message:\n${quotedMessage}\n${foundAcronymsMessage}`
  }

  return Object.freeze({
    createAcronym,
    defineAcronym,
  })
}
