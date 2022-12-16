import dotenv from 'dotenv'
dotenv.config()

import { createSlackApp } from './slack/app'
import { ENV_port, saasBased } from './utils/env'

async function main() {
  const port = ENV_port
  const app = createSlackApp()

  await app.start(port)

  const runningMode = saasBased ? '[SAAS Mode]' : '[Self Hosting]'
  console.log(`${runningMode}: 🔮 Kami is running on port: ${port}`)
}

main()
