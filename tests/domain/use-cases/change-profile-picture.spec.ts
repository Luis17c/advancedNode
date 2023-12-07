import { UUIDGenerator, UploadFile } from '@/domain/contracts/gateways'
import { SaveUserPicture } from '@/domain/contracts/repos'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'

import { MockProxy, mock } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenerator>
  let userProfileRepo: MockProxy<SaveUserPicture>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    userProfileRepo = mock()
    crypto = mock()
    crypto.uuid.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo)
  })

  it('should call uploasdFile with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({
      file,
      key: uuid
    })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })

  it('should not call uploasdFile when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(fileStorage.upload).not.toHaveBeenCalled()
  })

  it('should call saveUserPicture with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.savePicture).toHaveBeenCalledWith({
      pictureUrl: 'any_url'
    })
    expect(userProfileRepo.savePicture).toHaveBeenCalledTimes(1)
  })
})
