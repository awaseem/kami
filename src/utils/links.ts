import { getSlackAppId } from './env'

const slackAppId = getSlackAppId()

export function getAppHomeDeepLink(teamId: string) {
  return `slack://app?team=${teamId}&id=${slackAppId}`
}

export function getUserLink(userId: string) {
  return `https://slack.com/app_redirect?channel=${userId}`
}

export function getNotionPageUrl(pageId: string) {
  return `https://notion.so/${pageId}`
}
