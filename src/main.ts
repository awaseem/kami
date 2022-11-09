import dotenv from 'dotenv'
dotenv.config()

import { createSlackApp } from './slack/app'
import { getNotionAuthUrl, getPort } from './utils/env'

async function main() {
  const port = getPort()
  const app = createSlackApp()

  const notionAuthUrl = getNotionAuthUrl()
  console.log('Notion auth url: ' + notionAuthUrl)

  await app.start(port)
  console.log(`⚡️ Bolt app is running on port: ${port}`)
}

main()
