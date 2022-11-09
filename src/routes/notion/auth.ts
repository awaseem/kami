import type { ExpressReceiver } from '@slack/bolt'
import { Models } from '../../models'

export function createNotionAuthRoute(
  receiver: ExpressReceiver,
  models: Models,
) {
  receiver.router.get('/auth/notion', async (req, res) => {
    const { code } = req.query
    if (!code) {
      res.sendStatus(400)
      return
    }

    const accessToken = await models.notion.oauthExchange(code.toString())
    models.accessTokens.notionAccessTokenStore.set('', accessToken)

    res.sendStatus(200)
  })
}
