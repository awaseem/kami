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

export function getEnv<T>(key: string) {
  if (process.env.NODE_ENV == 'test') {
    return ''
  }

  return process.env[key]
}

// Hosting your own variables
export const ENV_disableStripeBilling = getEnv('DISABLE_STRIPE_BILLING')
export const ENV_notionSecretToken = getEnv('NOTION_SECRET_TOKEN')

export const saasBased = !(ENV_disableStripeBilling && ENV_notionSecretToken)

// production variables
export const ENV_slackSigningSecret = getEnvOrExit('SLACK_SIGNING_SECRET')

export const ENV_slackClientId = getEnvOrExit('SLACK_CLIENT_ID')
export const ENV_slackClintSecret = getEnvOrExit('SLACK_CLIENT_SECRET')
export const ENV_slackStateSecret = getEnvOrExit('SLACK_STATE_SECRET')
export const ENV_slackAppId = getEnvOrExit('SLACK_APP_ID')

export const ENV_hostname = getEnvOrExit('HOST_NAME')
export const ENV_port = getEnv('PORT') ?? '9000'

export const ENV_notionOauthClientId = saasBased
  ? getEnvOrExit('NOTION_OAUTH_CLIENT_ID')
  : ''
export const ENV_notionOauthClientSecret = saasBased
  ? getEnvOrExit('NOTION_OAUTH_CLIENT_SECRET')
  : ''
export const ENV_notionAuthUrl = saasBased
  ? getEnvOrExit('NOTION_AUTH_URL')
  : ''
export const ENV_notionRedirectUrl = saasBased
  ? getEnvOrExit('NOTION_REDIRECT_URL')
  : ''

export const ENV_redisUrl = getEnvOrExit('REDIS_URL')
export const ENV_redisToken = getEnvOrExit('REDIS_TOKEN')

export const ENV_openApiKey = getEnvOrExit('OPEN_AI_API_KEY')

export const ENV_stripeKey = saasBased ? getEnvOrExit('STRIPE_TOKEN') : ''
export const ENV_stripePricing = saasBased
  ? getEnvOrExit('STRIPE_PRICING_ID')
  : ''
export const ENV_stripeEndpointSecret = saasBased
  ? getEnvOrExit('STRIPE_ENDPOINT_SECRET')
  : ''

export function getNotionBasicAuth() {
  const clientID = ENV_notionOauthClientId
  const clientSecret = ENV_notionOauthClientSecret
  const token = `${clientID}:${clientSecret}`

  const base64Encoded = Buffer.from(token).toString('base64')

  return `Basic ${base64Encoded}`
}
