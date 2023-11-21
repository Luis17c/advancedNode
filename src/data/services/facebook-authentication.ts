import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contracts/api/facebook'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '../contracts/repos'

export class FacebookAuthenticationService {
  constructor (
    private readonly FacebookUserApi: LoadFacebookUserApi,
    private readonly UserAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.FacebookUserApi.loadUser(params)
    if (fbData !== undefined) {
      await this.UserAccountRepo.load({ email: fbData.email })
      await this.UserAccountRepo.createFromFacebook(fbData)
    }
    return new AuthenticationError()
  }
}
