import { FacebookLoginController } from '@/application/controllers'
import { makeFacebookAuthenticationUseCase } from '../use-cases/facebook-authentication'

export const makeFacebookLoginController = (): FacebookLoginController => {
  return new FacebookLoginController(makeFacebookAuthenticationUseCase())
}
