import fw from '@newsioaps/firebase-wrapper'
import { RootStore } from './index'
import { User } from '../models'

export class UserStore {
  // @ts-ignore
  private rootStore: RootStore
  public receiver: User | null

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    this.syncUserProfile()
  }

  private syncUserProfile() {
    const uid = '56e0312775317e0100db6f44'
    fw.auth.syncUserProfile(uid, user => {
      this.receiver = user ? new User(user) : null
    })
  }
}
