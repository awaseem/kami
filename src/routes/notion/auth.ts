import type { ExpressReceiver } from '@slack/bolt'
import { CustomContext } from '../../contexts'
import { Models } from '../../models'
import { getAppLink } from '../../utils/links'

export function createNotionAuthRoute(
  receiver: ExpressReceiver,
  models: Models,
  context: CustomContext,
) {
  receiver.router.get('/auth/notion', async (req, res) => {
    const { code, state } = req.query
    if (!code || !state) {
      res.status(400).send('Failed to create proper integration with notion.')
      return
    }

    const stateStr = state.toString()
    const [teamId, userId] = stateStr.split('-')

    const accessToken = await models.notion.oauthExchange(code.toString())
    await models.accessTokens.notion.setAccessToken(teamId, accessToken)

    await context.chat.sendDirectMessage(
      teamId,
      userId,
      `✅ Notion integration is complete! Don't forget to select a page for Kami to store it's information`,
    )

    res
      .status(200)
      .send(
        `Notion integration complete! Click <a href="${getAppLink()}">here</a> to return to Kami within slack`,
      )
  })
}
