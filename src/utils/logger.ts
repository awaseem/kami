export function logEventError(event: string, error: Error) {
  console.log(`[${event}]: ERROR occurred ${error.message}`)
}

export function logError(error: Error) {
  console.log(`[INTERNAL]: ERROR occurred internally ${error.message}`)
}
