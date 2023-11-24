export class ServerError extends Error {
  constructor (error?: Error) {
    super('Server Failed. Try again soon')
    this.name = 'ServerError'
    this.stack = error?.stack
  }
}
