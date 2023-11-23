import { LoadFacebookUserApi } from '@/data/contracts/api'
import { HttpGetClient } from '../http'

export class FacebookApi {
  private readonly baseUrl = 'https://graph.facebok.com'
  constructor (
    private readonly HttpClient: HttpGetClient,
    private readonly clientId: string,
    private readonly clientSecret: string
  ) {}

  async loadUser (params: LoadFacebookUserApi.Params): Promise<void> {
    await this.HttpClient.get({
      url: `${this.baseUrl}/oauth/access_token`,
      params: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }
    })
  }
}
