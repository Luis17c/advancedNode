import { LoadFacebookUserApi } from '@/data/contracts/api'
import { CreateFacebookAccountRepository, LoadUserAccountRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let facebookUserApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository> & MockProxy<CreateFacebookAccountRepository>

  beforeEach(() => {
    facebookUserApi = mock()
    userAccountRepo = mock()

    sut = new FacebookAuthenticationService(facebookUserApi, userAccountRepo)

    facebookUserApi.loadUser.mockResolvedValue({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
  })

  it('should call LoadfacebookUserApi with correct params', async () => {
    await sut.perform({ token: 'any_token' })

    expect(facebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadfacebookUserApi returns undefined', async () => {
    facebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoaduserAccountRepo when LoadfacebookUserApi returns data', async () => {
    await sut.perform({ token: 'any_token' })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateuserAccountRepo when LoadfacebookUserApi returns undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined)

    await sut.perform({ token: 'any_token' })

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })
})
