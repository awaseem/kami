import { WebClient } from '@slack/web-api'

export const SLACK_SCOPES = [
  'chat:write',
  'channels:history',
  'groups:history',
  'im:history',
  'mpim:history',
  'commands',
  'reactions:read',
]

export async function saySilent(
  client: WebClient,
  channelId: string,
  userId: string,
  text: string,
  threadTs?: string,
) {
  return client.chat.postEphemeral({
    channel: channelId,
    user: userId,
    text,
    thread_ts: threadTs,
  })
}

export async function sayToThread(
  client: WebClient,
  channelId: string,
  userId: string,
  text: string,
  threadTs?: string,
) {
  return client.chat.postMessage({
    channel: channelId,
    user: userId,
    text,
    thread_ts: threadTs,
  })
}
