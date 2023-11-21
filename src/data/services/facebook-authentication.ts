import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contracts/api/facebook'

export class FacebookAuthenticationService {
  constructor (private readonly loadUserApi: LoadFacebookUserApi) {
  }

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    await this.loadUserApi.loadUser(params)
    return new AuthenticationError()
  }
}
