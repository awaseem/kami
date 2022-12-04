import { createNotionClient } from '../lib/notion'
import { NotionError } from '../utils/error'

export interface CreatePageWithContentArgs {
  accessToken: string
  parentId: string
  heading: string
  content: string
}

async function createPageWithContent({
  accessToken,
  parentId,
  heading,
  content,
}: CreatePageWithContentArgs) {
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
    createPageWithContent,
  })
}
