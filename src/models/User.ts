import * as T from '@newsioaps/firebase-wrapper/types'

interface ConstructorOptions {
  id: string
  displayName?: string | null
  smallPhoto?: string | null
  mediumPhoto?: string | null
  largePhoto?: string | null
}

export class User {
  public id: string
  public displayName: string | null
  private smallPhoto: string | null
  private mediumPhoto: string | null
  private largePhoto: string | null

  constructor(opts: ConstructorOptions) {
    this.id = opts.id
    this.displayName = opts.displayName || null
    this.smallPhoto = opts.smallPhoto || null
    this.mediumPhoto = opts.mediumPhoto || null
    this.largePhoto = opts.largePhoto || null
  }

  public static createFromApi(user: T.IUserProfile) {
    return new User({
      id: user.id,
      displayName: user.displayName,
      smallPhoto: user.photoThumbnailURLSmall,
      mediumPhoto: user.photoThumbnailURLMedium,
      largePhoto: user.photoURL,
    })
  }

  getSmallPhoto(): string {
    return this.smallPhoto || this.mediumPhoto || this.largePhoto || '' // fallback to some default?
  }
}
