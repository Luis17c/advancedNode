import { HttpResponse, ok, unauthorized } from '../helpers'
import { AccessToken } from '@/domain/models'
import { ValidationBuilder, Validator } from '../validation'
import { Controller } from './controller'
import { AuthenticationError } from '@/domain/models/errors'

type HttpRequest = { token: string }
type Model = Error | { accessToken: string }

type FacebookAuthentication = (params: { token: string }) => Promise<AccessToken | AuthenticationError>

export class FacebookLoginController extends Controller {
  constructor (
    private readonly facebookAuthentication: FacebookAuthentication
  ) {
    super()
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    const accessToken = await this.facebookAuthentication({ token })
    return accessToken instanceof AccessToken
      ? ok({ accessToken: accessToken.value })
      : unauthorized()
  }

  override buildValidators ({ token }: HttpRequest): Validator[] {
    return [
      ...ValidationBuilder
        .of({ value: token, fieldName: 'token' })
        .required()
        .build()
    ]
  }
}
