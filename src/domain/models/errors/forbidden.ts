export class ForbiddenError extends Error {
  constructor () {
    super('Access Denied')
    this.name = 'ForbiddenError'
  }
}
