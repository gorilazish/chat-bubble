type AuthorType = 'me' | 'them'
type MessageType = 'text' | 'emoji'
type DataType = { text: string } | { emoji: string }

export interface IWidgetMessage {
  author: AuthorType
  type: MessageType,
  data: DataType
}

export interface IState {
  messageList: any
  conversationId: string | null
  subscriber: any
}

export interface IAgentProfile {
  teamName: string
  imageUrl: string
}