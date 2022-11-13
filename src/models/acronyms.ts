import { createNotionClient } from '../lib/notion'
import { getUserLink } from '../utils/links'
import { logError } from '../utils/logger'

async function createAcronym(
  accessToken: string,
  parentPageId: string,
  acronym: string,
  definition: string,
  userId: string,
) {
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
          url: getUserLink(userId),
        },
      },
    })
  } catch (error) {
    logError(error as Error)
  }
}

export function createAcronymModel() {
  return {
    createAcronym,
  }
}
