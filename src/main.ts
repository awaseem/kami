import dotenv from 'dotenv'
dotenv.config()

import { createSlackApp } from './slack/app'
import { ENV_port } from './utils/env'

async function main() {
  const port = ENV_port
  const app = createSlackApp()

  await app.start(port)
  console.log(`⚡️ Bolt app is running on port: ${port}`)
}

main()
