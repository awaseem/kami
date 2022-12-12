import type { ExpressReceiver } from '@slack/bolt'

export function createSystemRouter(receiver: ExpressReceiver) {
  receiver.router.get('/status', async (req, res) => {
    res.status(200).send('👍')
  })
}
