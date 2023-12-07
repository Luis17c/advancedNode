import { UserProfile } from '@/domain/models'

describe('user profile', () => {
  let sut = new UserProfile('any_id')

  beforeEach(() => {
    sut = new UserProfile('any_id')
  })

  it('should create with mpty initials when pictureUrl and name is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url', name: 'any_name' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('should create with mpty initials when only pictureUrl is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('should create initials with first letter of first and last names', () => {
    sut.setPicture({ name: 'Luis da Silva Claudio' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'LC'
    })
  })

  it('should create initials with two first letters of first name', () => {
    sut.setPicture({ name: 'Luis' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'LU'
    })
  })

  it('should create initials with two first letter of a letter', () => {
    sut.setPicture({ name: 'L' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'L'
    })
  })

  it('should create with empty initials when nothing is provided', () => {
    sut.setPicture({ })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined
    })
  })

  it('should return undefined initials when empty string is provided', () => {
    sut.setPicture({ name: '' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined
    })
  })
})
