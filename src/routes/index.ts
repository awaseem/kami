import { ExpressReceiver, Installation, InstallationQuery } from '@slack/bolt'
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

  const installationStore = saasBased
    ? {
        storeInstallation: async (installation: Installation) => {
          return await controllers.auth.storeInstall(installation)
        },
        fetchInstallation: async (installQuery: InstallationQuery<boolean>) => {
          return await controllers.auth.getInstall(installQuery)
        },
        deleteInstallation: async (
          installQuery: InstallationQuery<boolean>,
        ) => {
          return await controllers.auth.deleteInstall(installQuery)
        },
      }
    : undefined

  const receiver = new ExpressReceiver({
    ...auth,
    installationStore,
    installerOptions: {
      directInstall: true,
    },
  })

  return receiver
}
