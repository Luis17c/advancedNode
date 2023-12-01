import { TokenValidator } from '@/domain/contracts/crypto'
import { Authorize, setupAuthorize } from '@/domain/use-cases'
import { mock, MockProxy } from 'jest-mock-extended'

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
