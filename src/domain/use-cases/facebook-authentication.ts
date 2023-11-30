import { AuthenticationError } from '@/domain/models/errors'
import { LoadFacebookUserApi } from '@/domain/contracts/api/facebook'
import { SaveFacebookAccountRepository, LoadUserAccountRepository } from '@/domain/contracts/repos'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '@/domain/contracts/crypto'

type Setup = (
  FacebookUserApi: LoadFacebookUserApi,
  UserAccountRepo: LoadUserAccountRepository & SaveFacebookAccountRepository,
  crypto: TokenGenerator
) => FacebookAuthentication
export type FacebookAuthentication = (params: { token: string }) => Promise<{ accessToken: string }>

export const setupFacebookAuthentication: Setup = (FacebookUserApi, UserAccountRepo, crypto) => async params => {
  const fbData = await FacebookUserApi.loadUser(params)
  if (fbData !== undefined) {
    const accountData = await UserAccountRepo.load({ email: fbData.email })
    const fbAccount = new FacebookAccount(fbData, accountData)
    const { id } = await UserAccountRepo.saveWithFacebook(fbAccount)
    const accessToken = await crypto.generateToken({ key: id, expirationInMs: AccessToken.expirationInMs })
    return { accessToken }
  }
  throw new AuthenticationError()
}
