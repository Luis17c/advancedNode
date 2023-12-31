export interface SaveUserPicture {
  savePicture: (params: SaveUserPicture.Params) => Promise<void>
}

export namespace SaveUserPicture {
  export type Params = {
    id: string
    pictureUrl?: string
    initials?: string
  }
  // export type Result = void
}

export interface LoadUserProfile {
  load: (params: LoadUserProfile.Params) => Promise<LoadUserProfile.Result>
}

export namespace LoadUserProfile {
  export type Params = {
    id: string
  }
  export type Result = {
    name?: string
  }
}
