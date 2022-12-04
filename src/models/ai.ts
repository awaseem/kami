import ai from '../lib/openai'

async function generateContent(prompt: string) {
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
}

export function createAiModel() {
  return Object.freeze({
    generateContent,
  })
}
