import { Models } from '../models'
import { ControllerError } from '../utils/error'

export function createPageControllers(models: Models) {
  async function doesPageExist(teamId: string, pageId: string) {
    const accessToken = await models.accessTokens.notion.getAccessToken(teamId)
    if (!accessToken) {
      throw new ControllerError('no access token has been found')
    }

    const page = await models.notion.getNotionPage(accessToken, pageId)
    if (!page) {
      throw new ControllerError('Failed to get page')
    }

    return page
  }

  async function createRootAndPages(teamId: string, parentPageId: string) {
    const accessToken = await models.accessTokens.notion.getAccessToken(teamId)
    if (!accessToken) {
      throw new ControllerError('no access token has been found')
    }
    // Create root page
    const rootPage = await models.notion.createRootPage(
      accessToken,
      parentPageId,
    )
    const rootId = rootPage.id
    await models.notion.saveRootPage(teamId, rootId)

    // Create acronym database
    const acronymPage = await models.acronyms.createAcronymDatabase(
      accessToken,
      rootId,
    )
    if (acronymPage) {
      await models.notion.setAcronymPageId(teamId, acronymPage.id)
    }

    // Create FAQ database
    const faqPage = await models.faq.createFaqDatabase(accessToken, rootId)
    if (faqPage) {
      await models.notion.setFaqPageId(teamId, faqPage.id)
    }
  }

  return Object.freeze({
    doesPageExist,
    createRootAndPages,
  })
}
