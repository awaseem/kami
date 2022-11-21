import { App } from '@slack/bolt'
import { Controllers } from '../../controllers'

const CREATE_FAQ_SHORTCUT_MESSAGE = 'create_faq_message_shortcut'

export function createFaqHandlers(app: App, controllers: Controllers) {
  app.shortcut(CREATE_FAQ_SHORTCUT_MESSAGE, async ({ client, shortcut }) => {
    console.log(JSON.stringify(shortcut, null, 2))
  })
}
