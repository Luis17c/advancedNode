import { mock, MockProxy } from 'jest-mock-extended'

interface TokenValidator {
  validateToken: (params: TokenValidator.Params) => Promise<void>
}

namespace TokenValidator {
  export type Params = { token: string }
}

type Setup = (crypto: TokenValidator) => Authorize

type Authorize = (params: { token: string }) => Promise<void>

const setupAuthorize: Setup = crypto => async params => {
  await crypto.validateToken(params)
}

describe('Authorize', () => {
  let sut: Authorize
  let crypto: MockProxy<TokenValidator>
  let token: string

  beforeAll(() => {
    token = 'any_token'

    crypto = mock()
  })

  beforeEach(() => {
    sut = setupAuthorize(crypto)
  })

  it('should call Authorize with correct params', async () => {
    await sut({ token })

    expect(crypto.validateToken).toHaveBeenCalledWith({ token })
    expect(crypto.validateToken).toHaveBeenCalledTimes(1)
  })
})
