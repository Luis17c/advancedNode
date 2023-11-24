import { FacebookAuthentication } from '@/domain/features'
import { HttpResponse } from '../helpers'
import { AccessToken } from '@/domain/models'
import { ServerError } from '@/domain/errors'

export class FacebookLoginController {
  constructor (
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' ||
        httpRequest.token === null ||
        httpRequest.token === undefined) {
        return {
          statusCode: 400,
          data: new Error('The field token is required')
        }
      }

      const result = await this.facebookAuthentication.perform({ token: httpRequest.token })

      let statusCode: number
      if (result instanceof AccessToken) {
        statusCode = 200
      }
      return {
        statusCode: statusCode! ?? 401,
        data: result
      }
    } catch (err: any) {
      return {
        statusCode: 500,
        data: new ServerError(err)
      }
    }
  }
}
