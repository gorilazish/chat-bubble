import { UserStore } from './UserStore'

export class RootStore {
  public userStore: any

  constructor() {
    this.userStore = new UserStore(this)
  }
}
