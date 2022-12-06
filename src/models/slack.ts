import { createRedisStore } from './store'

export type SlackModel = ReturnType<typeof createSlackModel>

const slackInstallStore = createRedisStore('slack|install|objects')

export function createSlackModel() {
  return Object.freeze({
    setInstall: slackInstallStore.setObj,
    getInstall: slackInstallStore.getObj,
    deleteInstall: slackInstallStore.remove,
  })
}
