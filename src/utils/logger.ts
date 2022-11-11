import type { Logger } from '@slack/bolt'

export function logEventError(logger: Logger, event: string, error: Error) {
  console.log(`[${event}]: ERROR occurred ${error.message}`)
}

export function logError(error: Error) {
  console.log(`[INTERNAL]: ERROR occurred internally ${error.message}`)
}
