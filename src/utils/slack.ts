import { WebClient } from '@slack/web-api'

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
