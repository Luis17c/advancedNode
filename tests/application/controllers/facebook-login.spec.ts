import { FacebookLoginController } from '@/application/controllers'
import { RequiredStringValidator } from '@/application/validation'
import { AuthenticationError, UnauthorizedError } from '@/domain/models/errors'

jest.mock('@/application/validation/composite')

describe('FacebookLoginController', () => {
  let sut: FacebookLoginController
  let facebookAuth: jest.Mock
  let token: string

  beforeAll(() => {
    token = 'any_token'

    facebookAuth = jest.fn()
    facebookAuth.mockResolvedValue({ accessToken: 'any_value' })
  })

  beforeEach(() => {
    sut = new FacebookLoginController(facebookAuth)
  })

  it('should build Validators correctly', async () => {
    const validators = sut.buildValidators({ token })

    expect(validators).toEqual([
      new RequiredStringValidator('any_token', 'token')
    ])
  })

  it('should call fbAuth with correct params', async () => {
    await sut.handle({ token })

    expect(facebookAuth).toHaveBeenCalledWith({ token })
    expect(facebookAuth).toHaveBeenCalledTimes(1)
  })

  it('should return 401 if auth fail', async () => {
    facebookAuth.mockRejectedValueOnce(new AuthenticationError())

    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 401,
      data: new UnauthorizedError()
    })
  })

  it('should return 200 if auth succeeds', async () => {
    const httpResponse = await sut.handle({ token })

    expect(httpResponse).toEqual({
      statusCode: 200,
      data: {
        accessToken: 'any_value'
      }
    })
  })
})
