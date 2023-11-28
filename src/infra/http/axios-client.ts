import { HttpGetClient } from './client'
import Axios from 'axios'

type Params = HttpGetClient.Params

export class AxiosHttpClient implements HttpGetClient {
  async get ({ url, params }: Params): Promise<any> {
    const result = await Axios.get(url, { params })
    return result.data
  }
}
