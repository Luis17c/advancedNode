import { LoadFacebookUserApi } from '@/data/contracts/api'
import { CreateFacebookAccountRepository, LoadUserAccountRepository, UpdateFacebookAccountRepository } from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services'
import { AuthenticationError } from '@/domain/errors'
import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let facebookUserApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepo: MockProxy<LoadUserAccountRepository> & MockProxy<CreateFacebookAccountRepository> & MockProxy<UpdateFacebookAccountRepository>

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

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token: 'any_token' })

    expect(facebookUserApi.loadUser).toHaveBeenCalledWith({ token: 'any_token' })
    expect(facebookUserApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError when LoadFacebookUserApi returns undefined', async () => {
    facebookUserApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token: 'any_token' })

    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserAccountRepo when LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token: 'any_token' })

    expect(userAccountRepo.load).toHaveBeenCalledWith({ email: 'any_fb_email' })
    expect(userAccountRepo.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateUserAccountRepo when LoadFacebookUserApi returns undefined', async () => {
    userAccountRepo.load.mockResolvedValueOnce(undefined)

    await sut.perform({ token: 'any_token' })

    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_fb_name',
      email: 'any_fb_email',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepo.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call UpdateFacebookAccountRepo when LoadfacebookUserApi returns data', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })

    await sut.perform({ token: 'any_token' })

    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1)
  })

  it('should update accountName', async () => {
    userAccountRepo.load.mockResolvedValueOnce({
      id: 'any_id'
    })

    await sut.perform({ token: 'any_token' })

    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_fb_name',
      facebookId: 'any_fb_id'
    })
    expect(userAccountRepo.updateWithFacebook).toHaveBeenCalledTimes(1)
  })
})
