export class ServerError extends Error {
  constructor (error?: Error) {
    super('Server Failed. Try again soon')
    console.error(error)
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}

export class RequeridFieldError extends Error {
  constructor (fieldName: string) {
    super(`The field ${fieldName} is required`)
    this.name = 'ServerError'
  }
}
