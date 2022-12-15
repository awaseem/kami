import type { ExpressReceiver } from '@slack/bolt'
import { CustomContext } from '../../contexts'
import { AuthController } from '../../controllers/auth'
import { getAppLink } from '../../utils/links'

export function createNotionAuthRoute(
  receiver: ExpressReceiver,
  authController: AuthController,
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

    await authController.notionTokenExchange(teamId, code.toString())

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
