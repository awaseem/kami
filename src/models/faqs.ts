import { createNotionClient } from '../lib/notion'
import { NotionError } from '../utils/error'
import { getUserLink } from '../utils/links'

export interface CreateFaqArgs {
  accessToken: string
  databaseId: string
  question: string
  threadUrl: string
  channelName: string
  userId: string
  username: string
  answer: string
}

async function createFaq({
  accessToken,
  databaseId,
  question,
  channelName,
  threadUrl,
  userId,
  username,
  answer,
}: CreateFaqArgs) {
  try {
    const notion = createNotionClient(accessToken)

    return await notion.pages.create({
      parent: {
        database_id: databaseId,
      },
      properties: {
        Question: {
          title: [
            {
              text: {
                content: question,
              },
            },
          ],
        },
        Location: {
          rich_text: [
            {
              text: {
                content: channelName,
                link: {
                  url: threadUrl,
                },
              },
            },
          ],
        },
        ['Add by (Slack ID)']: {
          rich_text: [
            {
              text: {
                content: username,
                link: {
                  url: getUserLink(userId),
                },
              },
            },
          ],
        },
      },
      children: [
        {
          object: 'block',
          heading_1: {
            rich_text: [
              {
                text: {
                  content: '✅ Answer',
                },
              },
            ],
          },
        },
        {
          object: 'block',
          paragraph: {
            rich_text: [
              {
                text: {
                  content: answer,
                },
              },
            ],
            color: 'default',
          },
        },
        {
          object: 'block',
          heading_1: {
            rich_text: [
              {
                text: {
                  content: '📓 Additional notes',
                },
              },
            ],
          },
        },
      ],
    })
  } catch (error) {
    throw new NotionError(error as Error)
  }
}

async function createFaqDatabase(accessToken: string, parentId: string) {
  try {
    const notion = createNotionClient(accessToken)

    const response = await notion.databases.create({
      parent: {
        page_id: parentId,
      },
      icon: { emoji: '🙋' },
      title: [
        {
          type: 'text',
          text: {
            content: 'FAQ List',
            link: null,
          },
        },
      ],
      description: [
        {
          type: 'text',
          text: {
            content: 'All the FAQ Kami stores and uses.',
            link: null,
          },
        },
      ],
      properties: {
        Question: {
          type: 'title',
          title: {},
        },
        Location: {
          type: 'rich_text',
          rich_text: {},
        },
        ['Add by (Slack ID)']: {
          type: 'rich_text',
          rich_text: {},
        },
        ['Created at']: {
          type: 'created_time',
          created_time: {},
        },
        ['Last edited']: {
          type: 'last_edited_time',
          last_edited_time: {},
        },
      },
    })

    return response
  } catch (error) {
    throw new NotionError(error as Error)
  }
}

export function createFaqModel() {
  return {
    createFaqDatabase,
    createFaq,
  }
}
