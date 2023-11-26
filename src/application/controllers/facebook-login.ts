import { FacebookAuthentication } from '@/domain/features'
import { HttpResponse, badRequest, serverError, unauthorized } from '../helpers'
import { AccessToken } from '@/domain/models'
import { RequeridFieldError } from '@/domain/errors'

export class FacebookLoginController {
  constructor (
    private readonly facebookAuthentication: FacebookAuthentication
  ) {}

  async handle (httpRequest: any): Promise<HttpResponse> {
    try {
      if (httpRequest.token === '' ||
        httpRequest.token === null ||
        httpRequest.token === undefined) {
        return badRequest(new RequeridFieldError('token'))
      }

      const accessToken = await this.facebookAuthentication.perform({ token: httpRequest.token })

      if (accessToken instanceof AccessToken) {
        return {
          statusCode: 200,
          data: {
            accessToken: accessToken.value
          }
        }
      } else {
        return unauthorized()
      }
    } catch (err: any) {
      return serverError(err)
    }
  }
}
