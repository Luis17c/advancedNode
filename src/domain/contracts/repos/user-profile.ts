export interface SaveUserPicture {
  savePicture: (params: SaveUserPicture.Params) => Promise<void>
}

export namespace SaveUserPicture {
  export type Params = {
    pictureUrl: string | undefined
  }
  // export type Result = void
}

export interface LoadUserProfile {
  load: (params: LoadUserProfile.Params) => Promise<void>
}

export namespace LoadUserProfile {
  export type Params = {
    id: string
  }
}
