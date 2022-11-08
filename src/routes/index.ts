import { ExpressReceiver } from '@slack/bolt'
import { oauthExchange } from '../models/notion'
import { getSlackSigningSecret } from '../utils/env'

export function createRouter() {
  const receiver = new ExpressReceiver({
    signingSecret: getSlackSigningSecret(),
  })

  receiver.router.get('/auth/notion', async (req, res) => {
    const { code } = req.query
    if (!code) {
      res.sendStatus(400)
      return
    }

    // TODO store access token
    const accessToken = await oauthExchange(code.toString())

    res.sendStatus(200)
  })

  return receiver
}
