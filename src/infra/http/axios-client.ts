import { HttpGetClient } from './client'
import Axios from 'axios'

export class AxiosHttpClient {
  async get <T> (args: HttpGetClient.Params): Promise<T> {
    const result = await Axios.get(args.url, { params: args.params })
    return result.data
  }
}
