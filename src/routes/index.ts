import { ExpressReceiver } from '@slack/bolt'
import { Controllers } from '../controllers'
import {
  ENV_slackClientId,
  ENV_slackClintSecret,
  ENV_slackSecretToken,
  ENV_slackSigningSecret,
  ENV_slackStateSecret,
  saasBased,
} from '../utils/env'
import { SLACK_SCOPES } from '../utils/slack'

export function createRouter(controllers: Controllers) {
  const auth = saasBased
    ? {
        clientId: ENV_slackClientId,
        clientSecret: ENV_slackClintSecret,
        signingSecret: ENV_slackSigningSecret,
        stateSecret: ENV_slackStateSecret,
        scopes: SLACK_SCOPES,
      }
    : {
        token: ENV_slackSecretToken,
        signingSecret: ENV_slackSigningSecret,
      }

  const receiver = new ExpressReceiver({
    ...auth,

    installerOptions: {
      directInstall: true,
    },

    installationStore: {
      storeInstallation: async (installation) => {
        return await controllers.auth.storeInstall(installation)
      },
      fetchInstallation: async (installQuery) => {
        return await controllers.auth.getInstall(installQuery)
      },
      deleteInstallation: async (installQuery) => {
        return await controllers.auth.deleteInstall(installQuery)
      },
    },
  })

  return receiver
}
