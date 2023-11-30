import { FacebookAuthenticationService } from '@/domain/services'
import { makeFacebookApi } from '@/main/factories/apis'
import { makePgUserAccountRepo } from '../repos'
import { makeJwtTokenGenerator } from '../crypto'

export const makeFacebookAuthenticationService = (): FacebookAuthenticationService => {
  return new FacebookAuthenticationService(
    makeFacebookApi(),
    makePgUserAccountRepo(),
    makeJwtTokenGenerator()
  )
}
