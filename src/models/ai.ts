import ai from '../lib/openai'
import { OpenAPIError } from '../utils/error'

async function generateContent(prompt: string) {
  try {
    const cleanPrompt = prompt.trim()

    const response = await ai.createCompletion({
      prompt: cleanPrompt,
      model: 'text-davinci-003',
      temperature: 0.7,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    return response.data.choices?.[0].text
  } catch (error) {
    throw new OpenAPIError(error as Error)
  }
}

export function createAiModel() {
  return Object.freeze({
    generateContent,
  })
}
