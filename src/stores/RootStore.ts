import { UserStore, ConversationStore } from './index'
import * as T from '../types'

export class RootStore {
  public userStore: UserStore
  public convoStore: ConversationStore
  public readonly widgetSettings: T.IBelloWidgetSettings

  constructor(widgetSettings: T.IBelloWidgetSettings, persistedState: T.IPersistedState) {
    this.widgetSettings = widgetSettings
    this.userStore = new UserStore(this)
    this.convoStore = new ConversationStore(this, persistedState)
  }
}
