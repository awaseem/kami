import { createNotionClient } from '../lib/notion'
import { NotionError } from '../utils/error'
import { getUserLink } from '../utils/links'

export interface CreateAcronymArgs {
  accessToken: string
  databaseId: string
  acronym: string
  definition: string
  userId: string
  username: string
}

async function queryAcronyms(
  accessToken: string,
  databaseId: string,
  acronyms: string[],
) {
  try {
    const notion = createNotionClient(accessToken)

    const uniqueAcronyms = [...new Set(acronyms)]
    const orFilter = uniqueAcronyms.flatMap((acronym) => [
      {
        property: 'Acronym',
        title: {
          contains: acronym,
        },
      },
      {
        property: 'Acronym',
        title: {
          equals: acronym,
        },
      },
    ])

    const response = await notion.databases.query({
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

    return response
  } catch (error) {
    throw new NotionError(error as Error)
  }
}

async function createAcronym({
  accessToken,
  databaseId,
  acronym,
  definition,
  userId,
  username,
}: CreateAcronymArgs) {
  try {
    const notion = createNotionClient(accessToken)

    await notion.pages.create({
      parent: {
        database_id: databaseId,
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
    throw new NotionError(error as Error)
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
    throw new NotionError(error as Error)
  }
}

export function createAcronymModel() {
  return {
    createAcronymDatabase,
    createAcronym,
    queryAcronyms,
  }
}
