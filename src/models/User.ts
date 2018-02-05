import * as T from '@newsioaps/firebase-wrapper/types'

export class User {
  public displayName: string|null
  private smallPhoto: string|null
  private mediumPhoto: string|null
  private largePhoto: string|null

  constructor(user: T.IUserProfile) {
    this.displayName = user.displayName || null
    this.smallPhoto = user.photoThumbnailURLSmall || null
    this.mediumPhoto = user.photoThumbnailURLMedium || null
    this.largePhoto = user.photoURL || null
  }

  getSmallPhoto(): string {
    return this.smallPhoto || this.mediumPhoto || this.largePhoto || '' // fallback to some default?
  }
}