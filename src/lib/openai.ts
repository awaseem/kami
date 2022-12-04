import { Configuration, OpenAIApi } from 'openai'
import { ENV_openApiKey } from '../utils/env'

function createOpenAiClient() {
  const config = new Configuration({
    apiKey: ENV_openApiKey,
  })

  return new OpenAIApi(config)
}

const client = createOpenAiClient()
export default client
