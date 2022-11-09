export function getEnvOrExit(key: string) {
  const env = process.env[key]
  if (!env) {
    console.error(`Failed to locate key: ${key} in env variables`)
    process.exit(1)
  }

  return env
}

export function getSlackSigningSecret() {
  return getEnvOrExit('SLACK_SIGNING_SECRET')
}

export function getSlackToken() {
  return getEnvOrExit('SLACK_BOT_TOKEN')
}

export function getSlackAppId() {
  return getEnvOrExit('SLACK_APP_ID')
}

export function getPort() {
  return getEnvOrExit('PORT')
}

export function getNotionAuthUrl() {
  return getEnvOrExit('NOTION_AUTH_URL')
}

export function getNotionBasicAuth() {
  const clientID = getEnvOrExit('NOTION_OAUTH_CLIENT_ID')
  const clientSecret = getEnvOrExit('NOTION_OAUTH_CLIENT_SECRET')
  const token = `${clientID}:${clientSecret}`

  const base64Encoded = Buffer.from(token).toString('base64')

  return `Basic ${base64Encoded}`
}

export function getNotionRedirectUrl() {
  return getEnvOrExit('NOTION_REDIRECT_URL')
}

export function getRedisUrl() {
  return getEnvOrExit('REDIS_URL')
}

export function getRedisToken() {
  return getEnvOrExit('REDIS_TOKEN')
}
