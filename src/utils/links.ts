import { ENV_hostname, ENV_slackAppId } from './env'

const slackAppId = ENV_slackAppId

export function getAppHomeDeepLink(teamId: string, appId: string = slackAppId) {
  return `slack://app?team=${teamId}&id=${appId}`
}

export function getAppLink(appId: string = slackAppId) {
  return `https://slack.com/app_redirect?app=${appId}`
}

export function getChannelLink(channelId: string) {
  return `https://slack.com/app_redirect?channel=${channelId}`
}

export function getUserLink(userId: string) {
  return `https://slack.com/app_redirect?channel=${userId}`
}

export function getNotionPageUrl(pageId: string) {
  return `https://notion.so/${pageId.replaceAll('-', '')}`
}

export function getBillingLink() {
  return `${ENV_hostname}/billing`
}
