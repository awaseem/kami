import type { Logger } from '@slack/bolt'

export function logEventError(logger: Logger, event: string, error: Error) {
  console.log(`[${event}]: ERROR occurred ${error.message}`)
}
