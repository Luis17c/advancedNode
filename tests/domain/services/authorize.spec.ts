import { mock, MockProxy } from 'jest-mock-extended'

interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => Promise<string>
}

namespace TokenValidator {
  export type Params = { token: string }
}

type Setup = (crypto: TokenValidator) => Authorize

type Authorize = (params: { token: string }) => Promise<string>

const setupAuthorize: Setup = crypto => async params => {
  return await crypto.validateToken(params)
}

describe('Authorize', () => {
  let sut: Authorize
  let crypto: MockProxy<TokenValidator>
  let token: string

  beforeAll(() => {
    token = 'any_token'

    crypto = mock()
    crypto.validateToken.mockResolvedValue('any_user_id')
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })

  it('should call Authorize with correct params', async () => {
    await sut({ token })

    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })

  it('should return the correct accessToken', async () => {
    const result = await sut({ token })

    expect(result).toBe('any_user_id')
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })
})
