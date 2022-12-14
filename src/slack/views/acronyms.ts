import { WebClient } from '@slack/web-api'

export interface AcronymModalInitialValuesArgs {
  acronym?: string
  definition?: string
}

export const CREATE_ACRONYM_CALLBACK_ID = 'create_acronym_callback'
export const CREATE_ACRONYM_INPUT_LABEL = 'create_acronym_input_label'
export const CREATE_ACRONYM_INPUT_DESCRIPTION =
  'create_acronym_input_description'
export const CREATE_ACRONYM_INPUT_LABEL_ACTION =
  'create_acronym_input_label_action'
export const CREATE_ACRONYM_INPUT_DESCRIPTION_ACTION =
  'create_acronym_input_description_action'

export async function createAcronymModal(
  client: WebClient,
  triggerId: string,
  values?: AcronymModalInitialValuesArgs,
) {
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
            action_id: CREATE_ACRONYM_INPUT_LABEL_ACTION,
            initial_value: values?.acronym,
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
            action_id: CREATE_ACRONYM_INPUT_DESCRIPTION_ACTION,
            initial_value: values?.definition,
          },
          label: {
            type: 'plain_text',
            text: 'Definition',
            emoji: true,
          },
        },
      ],
    },
  })
}

export const DEFINE_ACRONYM_CALLBACK_ID = 'define_acronym_callback'
export const DEFINE_ACRONYM_INPUT_LABEL = 'define_acronym_input_label'
export const DEFINE_ACRONYM_INPUT_LABEL_ACTION =
  'define_acronym_input_label_action'

export async function defineAcronymModal(client: WebClient, triggerId: string) {
  return client.views.open({
    trigger_id: triggerId,
    view: {
      type: 'modal',
      callback_id: DEFINE_ACRONYM_CALLBACK_ID,
      title: {
        type: 'plain_text',
        text: 'Define acronym',
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
            text: 'Look up an acronym in your notion database.',
            emoji: true,
          },
        },
        {
          type: 'input',
          block_id: DEFINE_ACRONYM_INPUT_LABEL,
          element: {
            type: 'plain_text_input',
            action_id: DEFINE_ACRONYM_INPUT_LABEL_ACTION,
          },
          label: {
            type: 'plain_text',
            text: 'Search acronym',
            emoji: true,
          },
        },
      ],
    },
  })
}
