import { FacebookApi } from '@/infra/gateways'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('Facebook Api Integration Tests', () => {
  let axiosClient: AxiosHttpClient
  let sut: FacebookApi

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookApi(axiosClient, env.facebookApi.clientId, env.facebookApi.clientSecret)
  })
  it('should return a facebook user if token is valid', async () => {
    const fbUser = await sut.loadUser({ token: '' })

    expect(fbUser).toEqual({
      facebookId: '',
      email: '',
      name: ''
    })
  })

  it('should return undefined if token is invalid', async () => {
    const fbUser = await sut.loadUser({ token: 'invalid_token' })

    expect(fbUser).toBeUndefined()
  })
})
