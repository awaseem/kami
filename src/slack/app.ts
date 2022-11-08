import { App } from '@slack/bolt'
import { createRouter } from '../routes'
import { getSlackSigningSecret, getSlackToken } from '../utils/env'

export function createSlackApp() {
  const receiver = createRouter()

  const app = new App({
    token: getSlackToken(),
    signingSecret: getSlackSigningSecret(),
    receiver,
  })

  return app
}
