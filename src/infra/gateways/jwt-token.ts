import { TokenGenerator, TokenValidator } from '@/domain/contracts/gateways'
import { JwtPayload, sign, verify } from 'jsonwebtoken'

type Params = TokenGenerator.Params
type Result = TokenGenerator.Result

export class JwtTokenHandler implements TokenGenerator, TokenValidator {
  constructor (
    private readonly secret: string
  ) {}

  async generate ({ key, expirationInMs }: Params): Promise<Result> {
    const expirationInSeconds = expirationInMs / 1000
    return sign({ key }, this.secret, { expiresIn: expirationInSeconds })
  }

  async validate ({ token }: TokenValidator.Params): Promise<TokenValidator.Result> {
    const payload = verify(token, this.secret) as JwtPayload
    return payload.key
  }
}
