import { RootStore } from './index'

export class UserStore {
  // @ts-ignore
  private rootStore: RootStore

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
  }
}
