import { App } from '@slack/bolt'
import { Models } from '../models'
import { createChatContext } from './chat'

export type CustomContext = ReturnType<typeof createContext>

export function createContext(app: App, models: Models) {
  const chat = createChatContext(app, models.slack)

  return Object.freeze({
    chat,
  })
}
