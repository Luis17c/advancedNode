import { UUIDGenerator, UploadFile } from '../contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '../contracts/repos'
import { UserProfile } from '../models'

type Setup = (fileStorage: UploadFile, crypto: UUIDGenerator, userProfileRepo: SaveUserPicture & LoadUserProfile) => ChangeProfilePicture
type Input = { id: string, file?: Buffer }
type Output = { pictureUrl?: string, name?: string }
export type ChangeProfilePicture = (input: Input) => Promise<Output>

export const setupChangeProfilePicture: Setup = (fileStorage, crypto, userProfileRepo) => async ({ id, file }) => {
  const data = {
    pictureUrl: file !== undefined ? await fileStorage.upload({ file, key: crypto.uuid({ key: id }) }) : undefined,
    name: file == undefined ? (await userProfileRepo.load({ id })).name : undefined
  }
  const userProfile = new UserProfile(id)
  userProfile.setPicture(data)
  await userProfileRepo.savePicture(userProfile)
  return userProfile
}
