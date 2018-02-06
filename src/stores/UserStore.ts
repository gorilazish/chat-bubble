import fw from '@newsioaps/firebase-wrapper'
import { observable } from 'mobx'
import { RootStore } from './index'
import { User } from '../models'

export class UserStore {
  // @ts-ignore
  private rootStore: RootStore
  @observable private _receiver: User | null
  @observable private _guest: User | null
  @observable public hasLoaded: boolean = false

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    this.syncReceiverProfile()
  }

  public createGuest(): User {
    this._guest = new User({
      id: 'aQaTeLE1SBfEDKCJJErW94gGJvD2',
      displayName: 'Anonymous',
    })
    return this._guest
  }

  public get receiver(): User {
    return this._receiver!
  }

  public get guest(): User|null {
    return this._guest
  }

  private syncReceiverProfile() {
    const uid = this.rootStore.widgetSettings.userId
    fw.auth.syncUserProfile(uid, user => {
      this._receiver = user ? new User(user) : null
      this.hasLoaded = true
    })
  }
}