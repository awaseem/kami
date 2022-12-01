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
  parentMessageTs: string
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
  parentMessageTs,
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
        SlackMessageId: {
          rich_text: [
            {
              text: {
                content: parentMessageTs,
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
        SlackMessageId: {
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

async function queryFaq(
  accessToken: string,
  databaseId: string,
  keywords: string[],
) {
  const notion = createNotionClient(accessToken)
  const uniqueKeywords = [...new Set(keywords)]

  const orFilter = uniqueKeywords.flatMap((keyword) => [
    {
      property: 'Question',
      title: {
        contains: keyword,
      },
    },
  ])

  return await notion.databases.query({
    database_id: databaseId,
    filter: {
      or: orFilter,
    },
    sorts: [
      {
        property: 'Created at',
        direction: 'descending',
      },
    ],
  })
}

async function getFaqBySlackMessageTs(
  accessToken: string,
  databaseId: string,
  slackMessageTs: string,
) {
  const notion = createNotionClient(accessToken)

  return await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'SlackMessageId',
      rich_text: {
        equals: slackMessageTs,
      },
    },
    sorts: [
      {
        property: 'Created at',
        direction: 'descending',
      },
    ],
  })
}

async function appendAnswerToPage(
  accessToken: string,
  pageId: string,
  answer: string,
) {
  const notion = createNotionClient(accessToken)

  return await notion.blocks.children.append({
    block_id: pageId,
    children: [
      {
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
    ],
  })
}

export function createFaqModel() {
  return {
    createFaqDatabase,
    createFaq,
    queryFaq,
    getFaqBySlackMessageTs,
    appendAnswerToPage,
  }
}
