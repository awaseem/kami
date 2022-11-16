import dotenv from 'dotenv'
dotenv.config()

import { createSlackApp } from './slack/app'
import { getPort } from './utils/env'

async function main() {
  const port = getPort()
  const app = createSlackApp()

  await app.start(port)
  console.log(`⚡️ Bolt app is running on port: ${port}`)
}

main()
