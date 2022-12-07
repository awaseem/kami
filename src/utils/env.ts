export function getEnvOrExit(key: string) {
  if (process.env.NODE_ENV == 'test') {
    return ''
  }

  const env = process.env[key]
  if (!env) {
    console.error(`Failed to locate key: ${key} in env variables`)
    process.exit(1)
  }

  return env
}

export const ENV_slackClientId = getEnvOrExit('SLACK_CLIENT_ID')
export const ENV_slackClintSecret = getEnvOrExit('SLACK_CLIENT_SECRET')
export const ENV_slackSigningSecret = getEnvOrExit('SLACK_SIGNING_SECRET')
export const ENV_slackStateSecret = getEnvOrExit('SLACK_STATE_SECRET')

export const ENV_slackAppId = getEnvOrExit('SLACK_APP_ID')

export const ENV_hostname = getEnvOrExit('HOST_NAME')
export const ENV_port = getEnvOrExit('PORT')

export const ENV_notionAuthUrl = getEnvOrExit('NOTION_AUTH_URL')
export const ENV_notionRedirectUrl = getEnvOrExit('NOTION_REDIRECT_URL')
export const ENV_redisUrl = getEnvOrExit('REDIS_URL')
export const ENV_redisToken = getEnvOrExit('REDIS_TOKEN')

export const ENV_openApiKey = getEnvOrExit('OPEN_AI_API_KEY')

export const ENV_stripeKey = getEnvOrExit('STRIPE_TOKEN')
export const ENV_stripePricing = getEnvOrExit('STRIPE_PRICING_ID')
export const ENV_stripeEndpointSecret = getEnvOrExit('STRIPE_ENDPOINT_SECRET')

export function getNotionBasicAuth() {
  const clientID = getEnvOrExit('NOTION_OAUTH_CLIENT_ID')
  const clientSecret = getEnvOrExit('NOTION_OAUTH_CLIENT_SECRET')
  const token = `${clientID}:${clientSecret}`

  const base64Encoded = Buffer.from(token).toString('base64')

  return `Basic ${base64Encoded}`
}
