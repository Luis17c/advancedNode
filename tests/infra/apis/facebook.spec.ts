import { FacebookApi } from '@/infra/gateways'
import { HttpGetClient } from '@/infra/http'
import { MockProxy, mock } from 'jest-mock-extended'

describe('FacebookApi', () => {
  let clientId: string
  let clientSecret: string
  let grantType: string
  let sut: FacebookApi
  let httpClient: MockProxy<HttpGetClient>

  beforeAll(() => {
    httpClient = mock()

    clientId = 'any_client_id'
    clientSecret = 'any_client_secret'
    grantType = 'client_credentials'
  })

  beforeEach(() => {
    httpClient.get
      .mockResolvedValueOnce({
        access_token: 'any_app_token'
      })
      .mockResolvedValueOnce({
        data: { user_id: 'any_user_id' }
      })
      .mockResolvedValueOnce({
        id: 'any_fb_id',
        name: 'any_fb_name',
        email: 'any_fb_email'
      })
    sut = new FacebookApi(httpClient, clientId, clientSecret)
  })

  it('should get app token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/v18.0/oauth/access_token',
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: grantType
      }
    })
  })

  it('should get debug token', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/v18.0/debug_token',
      params: {
        access_token: 'any_app_token',
        input_token: 'any_client_token'
      }
    })
  })

  it('should get user info', async () => {
    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebook.com/v18.0/any_user_id',
      params: {
        fields: 'id,name,email',
        access_token: 'any_client_token'
      }
    })
  })

  it('should return facebook user', async () => {
    const fbUser = await sut.loadUser({ token: 'any_client_token' })

    expect(fbUser).toEqual({
      facebookId: 'any_fb_id',
      name: 'any_fb_name',
      email: 'any_fb_email'
    })
  })

  it('should return undefined if httpGetClient throws', async () => {
    httpClient.get.mockReset().mockRejectedValueOnce(new Error('fb_error'))

    const fbUser = await sut.loadUser({ token: 'any_client_token' })

    expect(fbUser).toBeUndefined()
  })
})
