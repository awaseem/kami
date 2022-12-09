import { WebClient } from '@slack/web-api'

export const CREATE_PAGE_PROMPT_CALLBACK_ID = 'create_page_prompt_callback'
export const CREATE_PAGE_PROMPT_INPUT_LABEL = 'create_page_prompt_input_label'
export const CREATE_PAGE_PROMPT_INPUT_LABEL_ACTION =
  'create_page_prompt_input_label_action'

export async function createPageWithPromptView(
  client: WebClient,
  triggerId: string,
) {
  return client.views.open({
    trigger_id: triggerId,
    view: {
      type: 'modal',
      callback_id: CREATE_PAGE_PROMPT_CALLBACK_ID,
      title: {
        type: 'plain_text',
        text: 'Create page with prompt',
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
            text: `Create a new page with AI generated content based on your prompt. For example you can try:\n\n"Brainstorm some ideas combining VR and fitness"\n\n"Create a new process for managing bugs in our products"`,
            emoji: true,
          },
        },
        {
          type: 'input',
          block_id: CREATE_PAGE_PROMPT_INPUT_LABEL,
          element: {
            type: 'plain_text_input',
            multiline: true,
            action_id: CREATE_PAGE_PROMPT_INPUT_LABEL_ACTION,
          },
          label: {
            type: 'plain_text',
            text: 'Create',
            emoji: true,
          },
        },
      ],
    },
  })
}
