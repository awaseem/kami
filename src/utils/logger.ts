export function logEventError(event: string, error: Error) {
  console.log(`[${event}]: ERROR occurred ${error.message}`)
}

export function logError(error: Error) {
  console.log(
    `[INTERNAL]: ERROR occurred internally ${error.message}. Error name: ${error.name}. Error object: ${error}`,
  )
}

export function logWarn(event: string, message: string) {
  console.log(`[${event}]: WARN occurred ${message}`)
}
