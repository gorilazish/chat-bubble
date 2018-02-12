import { ITemplate } from '@newsioaps/firebase-wrapper/types'

type AuthorType = 'me' | 'them'
type MessageType = 'text' | 'emoji' | 'templateMessage'
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
  template: ITemplate | null
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

// todo: this should be shared across our clients (fw, fc and etc)
export interface IMessageEventPayload {
  event: string
  sender: {
    id: string
  },
  receivers: { id: string }[]
  postback: any
}   