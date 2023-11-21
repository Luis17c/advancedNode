import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contracts/api/facebook'
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '../contracts/repos'

export class FacebookAuthenticationService {
  constructor (
    private readonly FacebookUserApi: LoadFacebookUserApi,
    private readonly UserAccountRepo: LoadUserAccountRepository & CreateFacebookAccountRepository & UpdateFacebookAccountRepository
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.FacebookUserApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.UserAccountRepo.load({ email: fbData.email })
      if (accountData !== undefined) {
        await this.UserAccountRepo.updateWithFacebook({
          id: accountData.id,
          name: accountData.name ?? fbData.name,
          facebookId: fbData.facebookId
        })
      } else {
        await this.UserAccountRepo.createFromFacebook(fbData)
      }
    }
    return new AuthenticationError()
  }
}
