import { UUIDGenerator, UploadFile } from '../contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '../contracts/repos'

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
type Input = { id: string, file?: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ id, file }) => {
  let pictureUrl: string | undefined
  let initials: string | undefined
  if (file !== undefined) {
    pictureUrl = await fileStorage.upload({ file, key: crypto.uuid({ key: id }) })
  } else {
    const { name } = await userProfileRepo.load({ id })
    const firstLetters = name?.match(/\b(.)/g) ?? []
    if (firstLetters.length > 1) {
      initials = `${firstLetters[0]?.toUpperCase() ?? ''}${firstLetters.pop()?.toUpperCase() ?? ' '}`
    } else {
      initials = name?.substring(0, 2).toUpperCase()
    }
  }
  await userProfileRepo.savePicture({ pictureUrl, initials })
}