import { createAccessTokensModel } from './accessTokens'
import { createAcronymModel } from './acronyms'
import { createAiModel } from './ai'
import { createBillingModel } from './billing'
import { createFaqModel } from './faqs'
import { createNotionModels } from './notion'
import { createPageModel } from './page'
import { createSlackModel } from './slack'

export type Models = ReturnType<typeof createModels>

export function createModels() {
  const accessTokens = createAccessTokensModel()
  const notion = createNotionModels()
  const acronyms = createAcronymModel()
  const faq = createFaqModel()
  const ai = createAiModel()
  const page = createPageModel()
  const slack = createSlackModel()
  const billing = createBillingModel()

  return Object.freeze({
    accessTokens,
    notion,
    acronyms,
    faq,
    ai,
    page,
    slack,
    billing,
  })
}
