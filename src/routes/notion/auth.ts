import type { ExpressReceiver } from '@slack/bolt'
import { Models } from '../../models'

export function createNotionAuthRoute(
  receiver: ExpressReceiver,
  models: Models,
) {
  receiver.router.get('/auth/notion', async (req, res) => {
    const { code, state } = req.query
    if (!code || !state) {
      res.status(400).send('Failed to create proper integration with notion.')
      return
    }

    const accessToken = await models.notion.oauthExchange(code.toString())
    await models.accessTokens.notion.setAccessToken(
      state.toString(),
      accessToken,
    )

    res
      .status(200)
      .send('Notion integration complete! You may now close this tab.')
  })
}
