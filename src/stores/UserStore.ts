import fw from '@newsioaps/firebase-wrapper'
import { observable, runInAction } from 'mobx'
import { RootStore } from './index'
import { User } from '../models'


export class UserStore {
  // @ts-ignore
  private rootStore: RootStore
  @observable private _receiver: User | null
  @observable private _guest: User | null
  @observable private _hasLoadedReceiver: boolean = false
  @observable private _hasLoadedGuest: boolean = false

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    this.syncReceiverProfile()
    this.syncGuestProfile()
  }

  public async createGuest(): Promise<User> {
    if (!this._guest) {
      const user = await fw.auth.signInAnonymously()
      this._guest = new User({
        id: user.uid,
      })
    }
    return this._guest
  }

  public get receiver(): User {
    return this._receiver!
  }

  public get guest(): User | null {
    return this._guest
  }

  public get hasLoadedReceiver(): boolean {
    return this._hasLoadedReceiver
  }

  public get hasLoadedGuest(): boolean {
    return this._hasLoadedGuest
  }

  private syncReceiverProfile() {
    const uid = this.rootStore.widgetSettings.userId
    fw.auth.syncUserProfile(uid, user => {
      runInAction(() => {
        this._receiver = user ? new User(user) : null
        this._hasLoadedReceiver = true
      })
    })
  }

  private syncGuestProfile() {
    fw.auth.syncAuth(auth => {
      runInAction(() => {
        this._guest = auth
          ? new User({
              id: auth.user.uid,
            })
          : null
        if (!this._guest) {
          this.rootStore.convoStore.clearCache()
        }
        this._hasLoadedGuest = true
      })
    })
  }
}
