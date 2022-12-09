import { createNotionClient } from '../lib/notion'
import { NotionError } from '../utils/error'

export interface CreatePageFromPromptArgs {
  accessToken: string
  parentId: string
  heading: string

  prompt: string
  content: string
}

export interface CreateSummaryFromThreadArgs {
  accessToken: string
  parentId: string
  heading: string

  threadLink: string
  content: string
}

async function createPromptPage({
  accessToken,
  parentId,
  heading,
  prompt,
  content,
}: CreatePageFromPromptArgs) {
  try {
    const notion = createNotionClient(accessToken)

    const response = await notion.pages.create({
      parent: {
        type: 'page_id',
        page_id: parentId,
      },
      icon: { type: 'emoji', emoji: '🔮' },
      properties: {
        title: {
          title: [
            {
              text: {
                content: heading,
              },
            },
          ],
        },
      },
      children: [
        {
          object: 'block',
          paragraph: {
            rich_text: [
              {
                text: {
                  content:
                    'Feel free to move this page. Open AI has generated the following page based on this prompt:',
                },
                annotations: {
                  bold: true,
                },
              },
            ],
          },
        },
        {
          object: 'block',
          quote: {
            rich_text: [
              {
                text: {
                  content: prompt,
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
                  content,
                },
              },
            ],
            color: 'default',
          },
        },
      ],
    })

    return response
  } catch (error) {
    throw new NotionError(error as Error)
  }
}

async function createSummaryFromThread({
  accessToken,
  parentId,
  heading,
  threadLink,
  content,
}: CreateSummaryFromThreadArgs) {
  try {
    const notion = createNotionClient(accessToken)

    const response = await notion.pages.create({
      parent: {
        type: 'page_id',
        page_id: parentId,
      },
      icon: { type: 'emoji', emoji: '🔮' },
      properties: {
        title: {
          title: [
            {
              text: {
                content: heading,
              },
            },
          ],
        },
      },
      children: [
        {
          object: 'block',
          paragraph: {
            rich_text: [
              {
                text: {
                  content:
                    'Feel free to move this page. Open AI has generated the following summary based on this ',
                },
                annotations: {
                  bold: true,
                },
              },
              {
                text: {
                  content: 'thread',
                  link: {
                    url: threadLink,
                  },
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
                  content,
                },
              },
            ],
            color: 'default',
          },
        },
      ],
    })

    return response
  } catch (error) {
    throw new NotionError(error as Error)
  }
}

export function createPageModel() {
  return Object.freeze({
    createPromptPage,
    createSummaryFromThread,
  })
}
