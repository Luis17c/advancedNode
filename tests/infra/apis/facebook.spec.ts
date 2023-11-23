import { LoadFacebookUserApi } from '@/data/contracts/api'
import { mock } from 'jest-mock-extended'

class FacebookApi {
  private readonly baseUrl = 'https://graph.facebok.com'
  constructor (
    private readonly HttpClient: HttpGetClient
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    await this.HttpClient.get({
      url: `${this.baseUrl}/oauth/access_token`
    })
  }
}

interface HttpGetClient {
  get: (params: HttpGetClient.Params) => Promise<void>
}

namespace HttpGetClient {
  export type Params = {
    url: string
  }
}

describe('FacebookApi', () => {
  it('should get app token', async () => {
    const httpClient = mock<HttpGetClient>()
    const sut = new FacebookApi(httpClient)

    await sut.loadUser({ token: 'any_client_token' })

    expect(httpClient.get).toHaveBeenCalledWith({
      url: 'https://graph.facebok.com/oauth/access_token'
    })
  })
})
