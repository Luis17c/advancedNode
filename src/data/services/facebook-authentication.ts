import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '../contracts/api/facebook'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '../contracts/repos'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '../contracts/crypto'

export class FacebookAuthenticationService {
  constructor (
    private readonly FacebookUserApi: LoadFacebookUserApi,
    private readonly UserAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<AuthenticationError> {
    const fbData = await this.FacebookUserApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.UserAccountRepo.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await this.UserAccountRepo.saveWithFacebook(fbAccount)
      await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
    }
    return new AuthenticationError()
  }
}
