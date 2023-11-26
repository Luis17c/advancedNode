import { ValidationComposite, Validator } from '@/application/validation'
import { MockProxy, mock } from 'jest-mock-extended'

describe('ValidationComposite', () => {
  let sut: ValidationComposite
  let validator1: MockProxy<Validator>
  let validator2: MockProxy<Validator>

  beforeAll(() => {
    validator1 = mock()
    validator1.validate.mockReturnValue(undefined)
    validator2 = mock()
    validator2.validate.mockReturnValue(undefined)
  })

  beforeEach(() => {
    const validators = [validator1, validator2]
    sut = new ValidationComposite(validators)
  })

  it('should return undefined if all validators returns undefined', () => {
    const error = sut.validate()

    expect(error).toBeUndefined()
  })

  it('should return the first error if the first validator return error', () => {
    validator1.validate.mockReturnValueOnce(new Error('validation_error_1'))
    validator2.validate.mockReturnValueOnce(new Error('validation_error_2'))
    sut = new ValidationComposite([validator1, validator2])

    const error = sut.validate()

    expect(error).toEqual(new Error('validation_error_1'))
  })

  it('should return an error if a validator return error', () => {
    validator2.validate.mockReturnValueOnce(new Error('validation_error_2'))
    sut = new ValidationComposite([validator1, validator2])

    const error = sut.validate()

    expect(error).toEqual(new Error('validation_error_2'))
  })
})
