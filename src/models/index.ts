import { createAccessTokensModel } from './accessTokens'
import { createAcronymModel } from './acronyms'
import { createFaqModel } from './faqs'
import { createNotionModels } from './notion'

export type Models = ReturnType<typeof createModels>

export function createModels() {
  const accessTokens = createAccessTokensModel()
  const notion = createNotionModels()
  const acronyms = createAcronymModel()
  const faq = createFaqModel()

  return Object.freeze({
    accessTokens,
    notion,
    acronyms,
    faq,
  })
}
