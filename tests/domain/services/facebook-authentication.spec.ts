import { LoadFacebookUser, TokenGenerator } from '@/domain/contracts/gateways'
import { LoadUserAccount, SaveFacebookAccount } from '@/domain/contracts/repos'
import { FacebookAuthentication, setupFacebookAuthentication } from '@/domain/use-cases'
import { AuthenticationError } from '@/domain/models/errors'
import { AccessToken, FacebookAccount } from '@/domain/models'

import { mock, MockProxy } from 'jest-mock-extended'

jest.mock('@/domain/models/facebook-account')

describe('FacebookAuthenticationUseCase', () => {
  let sut: FacebookAuthentication
  let token: MockProxy<TokenGenerator>
  let facebookUserApi: MockProxy<LoadFacebookUser>
  let userAccountRepo: MockProxy<LoadUserAccount> & MockProxy<SaveFacebookAccount>
  let generatedToken: string

  beforeAll(() => {
    generatedToken = 'any_token'

    facebookUserApi = mock()
    facebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })

    userAccountRepo = mock()
    userAccountRepo.load.mockResolvedValue(undefined)
    userAccountRepo.saveWithFacebook.mockResolvedValue({ id: 'any_account_id' })

    token = mock()
    token.generate.mockResolvedValue('any_generated_token')
  })

  beforeEach(() => {
    sut = setupFacebookAuthentication(
      facebookUserApi,
      userAccountRepo,
      token
    )
  })

  it('should call LoadFacebookUser with correct params', async () => {
    await sut({ token: generatedToken })

    expect(facebookUserApi.loadUser).toHaveBeenCalledWith({ token: generatedToken })
    expect(facebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUser returns undefined', async () => {
    facebookUserApi.loadUser.mockResolvedValueOnce(undefined)

    const promise = sut({ token: generatedToken })

    await expect(promise).rejects.toThrow(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebookUser returns data', async () => {
    await sut({ token: generatedToken })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should call SaveFacebookAccount with FacebookAccount', async () => {
    jest.mocked(FacebookAccount).mockImplementation(jest.fn().mockImplementation(() => ({
      any: 'any'
    })))

    await sut({ token: generatedToken })

    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledWith({
      any: 'any'
    })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call TokenGenerator with correct params', async () => {
    await sut({ token: generatedToken })

    expect(token.generate).toHaveBeenCalledWith({
      key: 'any_account_id',
      expirationInMs: AccessToken.expirationInMs
    })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should return an AccessToken on success', async () => {
    const authResult = await sut({ token: generatedToken })

    expect(authResult).toEqual({ accessToken: 'any_generated_token' })
    expect(userAccountRepo.saveWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should rethrow if loadFacebookUserApi throws', async () => {
    facebookUserApi.loadUser.mockRejectedValueOnce(new Error('fb_error'))

    const promise = sut({ token: generatedToken })

    await expect(promise).rejects.toThrow(new Error('fb_error'))
  })

  it('should rethrow if loadFacebookUserApi throws', async () => {
    userAccountRepo.load.mockRejectedValueOnce(new Error('load_error'))

    const promise = sut({ token: generatedToken })

    await expect(promise).rejects.toThrow(new Error('load_error'))
  })

  it('should rethrow if loadFacebookUserApi throws', async () => {
    userAccountRepo.saveWithFacebook.mockRejectedValueOnce(new Error('save_error'))

    const promise = sut({ token: generatedToken })

    await expect(promise).rejects.toThrow(new Error('save_error'))
  })

  it('should rethrow if loadFacebookUserApi throws', async () => {
    token.generate.mockRejectedValueOnce(new Error('token_error'))

    const promise = sut({ token: generatedToken })

    await expect(promise).rejects.toThrow(new Error('token_error'))
  })
})
