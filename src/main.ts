import * as dotenv from 'dotenv'
import { createSlackApp } from './slack/app'
import { getPort } from './utils/env'

async function main() {
  dotenv.config()

  const port = getPort()
  const app = createSlackApp()

  await app.start(port)
  console.log(`⚡️ Bolt app is running on port: ${port}`)
}

main()
