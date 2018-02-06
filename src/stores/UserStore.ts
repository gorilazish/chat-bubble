import fw from '@newsioaps/firebase-wrapper'
import { observable } from 'mobx'
import { RootStore } from './index'
import { User } from '../models'

export class UserStore {
  // @ts-ignore
  private rootStore: RootStore
  @observable public receiver: User | null
  @observable public hasLoaded: boolean = false

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    this.syncUserProfile()
  }

  private syncUserProfile() {
    const uid = this.rootStore.widgetSettings.userId
    fw.auth.syncUserProfile(uid, user => {
      this.receiver = user ? new User(user) : null
      this.hasLoaded = true
    })
  }
}
