import { getSlackAppId } from './env'

const slackAppId = getSlackAppId()

export function getAppHomeDeepLink(teamId: string) {
  return `slack://app?team=${teamId}&id=${slackAppId}`
}
