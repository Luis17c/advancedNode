export interface TokenGenerator {
  generate: (params: TokenGenerator.Params) => Promise<TokenGenerator.Result>
}

export namespace TokenGenerator {
  export type Params = {
    key: string
    expirationInMs: number
  }
  export type Result = string
}

export interface TokenValidator {
  validate: (params: TokenValidator.Params) => Promise<string>
}

export namespace TokenValidator {
  export type Params = { token: string }
  export type Result = string
}
