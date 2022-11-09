export function logEventError(event: string, error: Error) {
  console.log(`[${event}]: ERROR occurred ${error.message}`)
}
