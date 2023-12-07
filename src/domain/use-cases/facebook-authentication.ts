import { AuthenticationError } from '@/domain/models/errors'
import { LoadFacebookUser } from '@/domain/contracts/gateways/facebook'
import { SaveFacebookAccount, LoadUserAccount } from '@/domain/contracts/repos'
import { AccessToken, FacebookAccount } from '@/domain/models'
import { TokenGenerator } from '@/domain/contracts/gateways'

type Setup = (
  FacebookUserApi: LoadFacebookUser,
  UserAccountRepo: LoadUserAccount & SaveFacebookAccount,
  token: TokenGenerator
) => FacebookAuthentication
export type FacebookAuthentication = (params: { token: string }) => Promise<{ accessToken: string }>

export const setupFacebookAuthentication: Setup = (FacebookUserApi, UserAccountRepo, token) => async params => {
  const fbData = await FacebookUserApi.loadUser(params)
  if (fbData !== undefined) {
    const accountData = await UserAccountRepo.load({ email: fbData.email })
    const fbAccount = new FacebookAccount(fbData, accountData)
    const { id } = await UserAccountRepo.saveWithFacebook(fbAccount)
    const accessToken = await token.generate({ key: id, expirationInMs: AccessToken.expirationInMs })
    return { accessToken }
  }
  throw new AuthenticationError()
}
