import { UserStore } from './UserStore'
import * as T from '../types'

export class RootStore {
  public userStore: UserStore
  public readonly widgetSettings: T.IBelloWidgetSettings

  constructor(widgetSettings: T.IBelloWidgetSettings) {
    this.widgetSettings = widgetSettings
    this.userStore = new UserStore(this)
  }
}
