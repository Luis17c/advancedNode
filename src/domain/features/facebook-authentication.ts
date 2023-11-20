import { AuthenticationError } from '../errors'
import { AccessToken } from '../models'

export interface FacebookAuthentication {
  perform: (params: FacebookAuthentication.Params) => FacebookAuthentication.Result
}

namespace FacebookAuthentication {
  export type Params = {
    token: string
  }

  export type Result = {
    response: AccessToken | AuthenticationError
  }

}
