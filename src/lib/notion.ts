import { Client, LogLevel } from '@notionhq/client'

export function createNotionClient(accessToken: string) {
  return new Client({
    auth: accessToken,
    logLevel:
      process.env.NODE_ENV === 'production' ? LogLevel.DEBUG : undefined,
  })
}
