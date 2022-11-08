import { ExpressReceiver } from '@slack/bolt'
import { getSlackSigningSecret } from '../utils/env'

export function createRouter() {
  const receiver = new ExpressReceiver({
    signingSecret: getSlackSigningSecret(),
  })

  return receiver
}
