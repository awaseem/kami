import { createNotionClient } from '../lib/notion'
import { getUserLink } from '../utils/links'
import { logError } from '../utils/logger'

export interface CreateAcronymArgs {
  accessToken: string
  parentPageId: string
  acronym: string
  definition: string
  userId: string
  username: string
}

async function createAcronym({
  accessToken,
  parentPageId,
  acronym,
  definition,
  userId,
  username,
}: CreateAcronymArgs) {
  try {
    const notion = createNotionClient(accessToken)

    await notion.pages.create({
      parent: {
        database_id: parentPageId,
      },
      properties: {
        Acronym: {
          title: [
            {
              text: {
                content: acronym,
              },
            },
          ],
        },
        Definition: {
          rich_text: [
            {
              text: {
                content: definition,
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
    })
  } catch (error) {
    logError(error as Error)
  }
}

async function createAcronymDatabase(accessToken: string, parentId: string) {
  try {
    const notion = createNotionClient(accessToken)

    const response = await notion.databases.create({
      parent: {
        page_id: parentId,
      },
      icon: { emoji: '📕' },
      title: [
        {
          type: 'text',
          text: {
            content: 'Acronym List',
            link: null,
          },
        },
      ],
      description: [
        {
          type: 'text',
          text: {
            content: 'All the acronyms Kami stores and uses.',
            link: null,
          },
        },
      ],
      properties: {
        Acronym: {
          type: 'title',
          title: {},
        },
        Definition: {
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
    logError(error as Error)
  }
}

export function createAcronymModel() {
  return {
    createAcronymDatabase,
    createAcronym,
  }
}
