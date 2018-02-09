type AuthorType = 'me' | 'them'
type MessageType = 'text' | 'emoji'
type DataType = { text: string } | { emoji: string }

export interface IBelloWidgetSettings {
  userId: string
}

export type IPersistedState = {
  conversationId: string
}

export interface IWidgetMessage {
  author: AuthorType
  authorImage?: string
  type: MessageType
  data: DataType
}

export interface IState {
  messageList: any
  conversationId: string | null
  subscriber: any
}
