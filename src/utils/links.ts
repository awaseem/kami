import { ENV_slackAppId } from './env'

const slackAppId = ENV_slackAppId

export function getAppHomeDeepLink(teamId: string) {
  return `slack://app?team=${teamId}&id=${slackAppId}`
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
