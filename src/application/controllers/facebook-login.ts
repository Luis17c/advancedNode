import { FacebookAuthentication } from '@/domain/use-cases'
import { HttpResponse, ok, unauthorized } from '../helpers'
import { ValidationBuilder, Validator } from '../validation'
import { Controller } from './controller'

type HttpRequest = { token: string }
type Model = Error | { accessToken: string }

export class FacebookLoginController extends Controller {
  constructor (
    private readonly facebookAuthentication: FacebookAuthentication
  ) {
    super()
  }

  async perform ({ token }: HttpRequest): Promise<HttpResponse<Model>> {
    try {
      const accessToken = await this.facebookAuthentication({ token })
      return ok(accessToken)
    } catch {
      return unauthorized()
    }
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
