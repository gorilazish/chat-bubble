
export interface IBelloWidgetSettings {
  userId: string
}

export type IPersistedState = {
  conversationId: string
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
export interface IPostbackEvent {
  postId: string
  messageId: string
  payload: string
  sender: {
    id: string
  }
  receivers: { id: string }[]
  data: any
}
