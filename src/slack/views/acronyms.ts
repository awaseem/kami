import { WebClient } from '@slack/web-api'

export const CREATE_ACRONYM_CALLBACK_ID = 'create_acronym_callback'
export const CREATE_ACRONYM_INPUT_LABEL = 'create_acronym_input_label'
export const CREATE_ACRONYM_INPUT_DESCRIPTION =
  'create_acronym_input_description'

export async function createAcronymModal(client: WebClient, triggerId: string) {
  return client.views.open({
    trigger_id: triggerId,
    view: {
      type: 'modal',
      callback_id: CREATE_ACRONYM_CALLBACK_ID,
      title: {
        type: 'plain_text',
        text: 'New acronym',
        emoji: true,
      },
      submit: {
        type: 'plain_text',
        text: 'Submit',
        emoji: true,
      },
      close: {
        type: 'plain_text',
        text: 'Cancel',
        emoji: true,
      },
      blocks: [
        {
          type: 'section',
          text: {
            type: 'plain_text',
            text: 'Create a new acronym. Make sure the description is useful!',
            emoji: true,
          },
        },
        {
          type: 'input',
          block_id: CREATE_ACRONYM_INPUT_LABEL,
          element: {
            type: 'plain_text_input',
            action_id: 'plain_text_input-action',
          },
          label: {
            type: 'plain_text',
            text: 'Acronym',
            emoji: true,
          },
        },
        {
          type: 'input',
          block_id: CREATE_ACRONYM_INPUT_DESCRIPTION,
          element: {
            type: 'plain_text_input',
            multiline: true,
            action_id: 'plain_text_input-action',
          },
          label: {
            type: 'plain_text',
            text: 'Description',
            emoji: true,
          },
        },
      ],
    },
  })
}
