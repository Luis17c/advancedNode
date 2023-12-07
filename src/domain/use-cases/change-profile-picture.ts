import { UUIDGenerator, UploadFile } from '../contracts/gateways'
import { SaveUserPicture } from '../contracts/repos'

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture) => ChangeProfilePicture
type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ id, file }) => {
  if (file !== undefined) {
    const pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: id }) })
    await userProfileRepo.savePicture({ pictureUrl })
  }
}
