import { RequiredStringValidator } from '@/application/validation'
import { RequeridFieldError } from '@/domain/errors'

describe('RequiredStringValidator', () => {
  let sut: RequiredStringValidator

  it('should return RequiredFieldError if value is empty', () => {
    sut = new RequiredStringValidator('', 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequeridFieldError('any_field'))
  })

  it('should return RequiredFieldError if value is null', () => {
    sut = new RequiredStringValidator(null as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequeridFieldError('any_field'))
  })

  it('should return RequiredFieldError if value is undefined', () => {
    sut = new RequiredStringValidator(undefined as any, 'any_field')

    const error = sut.validate()

    expect(error).toEqual(new RequeridFieldError('any_field'))
  })

  it('should return undefined if value is not empty', () => {
    sut = new RequiredStringValidator('any_value', 'any_field')

    const error = sut.validate()

    expect(error).toBeUndefined()
  })
})
