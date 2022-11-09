import { WebClient } from '@slack/web-api'

export function ErrorModel(
  client: WebClient,
  triggerId: string,
  markdown: string,
) {
  return client.views.open({
    trigger_id: triggerId,
    view: {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: 'Whoops!',
      },
      close: {
        type: 'plain_text',
        text: 'Close',
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: markdown,
          },
        },
      ],
    },
  })
}
