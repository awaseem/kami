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

export function getPort() {
  return getEnvOrExit('PORT')
}
