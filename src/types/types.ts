type AuthorType = 'me' | 'them'
type MessageType = 'text' | 'emoji'
type DataType = { text: string } | { emoji: string }

export interface IBelloWidgetSettings {
  userId: string
}

export type IPersistedState = {
  conversationId: string
} | null

export interface IWidgetMessage {
  author: AuthorType
  type: MessageType
  data: DataType
}

export interface IState {
  messageList: any
  conversationId: string | null
  subscriber: any
}

export interface ICreateConversationBody {
  receiverId: string
  senderId: string
  message: string
  defaultMessage: string
}
