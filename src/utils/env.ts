export function getEnvOrExit(key: string) {
  const env = process.env[key]
  if (!env) {
    console.error(`Failed to locate key: ${key} in env variables`)
    process.exit(1)
  }

  return env
}

export const ENV_slackSigningSecret = getEnvOrExit('SLACK_SIGNING_SECRET')
export const ENV_slackToken = getEnvOrExit('SLACK_BOT_TOKEN')
export const ENV_slackAppId = getEnvOrExit('SLACK_APP_ID')

export const ENV_port = getEnvOrExit('PORT')
export const ENV_notionAuthUrl = getEnvOrExit('NOTION_AUTH_URL')
export const ENV_notionRedirectUrl = getEnvOrExit('NOTION_REDIRECT_URL')
export const ENV_redisUrl = getEnvOrExit('REDIS_URL')
export const ENV_redisToken = getEnvOrExit('REDIS_TOKEN')

export const ENV_openApiKey = getEnvOrExit('OPEN_AI_API_KEY')

export function getNotionBasicAuth() {
  const clientID = getEnvOrExit('NOTION_OAUTH_CLIENT_ID')
  const clientSecret = getEnvOrExit('NOTION_OAUTH_CLIENT_SECRET')
  const token = `${clientID}:${clientSecret}`

  const base64Encoded = Buffer.from(token).toString('base64')

  return `Basic ${base64Encoded}`
}
