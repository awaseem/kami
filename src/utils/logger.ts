import type { RespondFn } from '@slack/bolt'
import { ControllerError } from './error'

export function logEventError(event: string, error: Error) {
  console.log(`[${event}]: ERROR occurred ${error.message}`)
}

export function logError(error: Error) {
  console.log(`[INTERNAL]: ERROR occurred internally ${error.message}`)
}

export function respondError(event: string, error: Error, respond: RespondFn) {
  logEventError(event, error)

  if (error instanceof ControllerError) {
    respond(error.message)
  } else {
    respond('Unknown error occurred: ' + error.message)
  }
}
