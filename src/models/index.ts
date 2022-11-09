import { createAccessTokensModel } from './accessTokens'
import { createNotionModels } from './notion'

export type Models = ReturnType<typeof createModels>

export function createModels() {
  const accessTokens = createAccessTokensModel()
  const notion = createNotionModels()

  return Object.freeze({
    accessTokens,
    notion,
  })
}
