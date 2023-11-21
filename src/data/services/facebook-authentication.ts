import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contracts/api/facebook'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '../contracts/repos'
import { FacebookAccount } from '@/domain/models'

export class FacebookAuthenticationService {
  constructor (
    private readonly FacebookUserApi: LoadFacebookUserApi,
    private readonly UserAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.FacebookUserApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.UserAccountRepo.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      await this.UserAccountRepo.saveWithFacebook(fbAccount)
    }
    return new AuthenticationError()
  }
}
