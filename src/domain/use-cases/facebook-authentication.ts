import { AuthenticationError } from '@/domain/models/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/domain/contracts/api/facebook'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/domain/contracts/repos'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '@/domain/contracts/crypto'

export class FacebookAuthenticationUseCase implements FacebookAuthentication {
  constructor (
    private readonly FacebookUserApi: LoadFacebookUserApi,
    private readonly UserAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
    private readonly crypto: TokenGenerator
  ) {}

  async perform (params: FacebookAuthentication.Params): Promise<FacebookAuthentication.Result> {
    const fbData = await this.FacebookUserApi.loadUser(params)
    if (fbData !== undefined) {
      const accountData = await this.UserAccountRepo.load({ email: fbData.email })
      const fbAccount = new FacebookAccount(fbData, accountData)
      const { id } = await this.UserAccountRepo.saveWithFacebook(fbAccount)
      const token = await this.crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
      return new AccessToken(token)
    }
    return new AuthenticationError()
  }
}
