import { FacebookApi } from '@/infra/gateways'
import { env } from '@/main/config/env'
import { makeAxiosClient } from '../http'

export const makeFacebookApi = (): FacebookApi => {
  return new FacebookApi(
    makeAxiosClient(),
    env.facebookApi.clientId,
    env.facebookApi.clientSecret
  )
}
