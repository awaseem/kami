export class ControllerError extends Error {
  constructor(msg: string) {
    super(`Whoops: ${msg}`)
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ControllerError.prototype)
  }
}
