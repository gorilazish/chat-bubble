import * as FWT from '@newsioaps/firebase-wrapper/types'

export interface Message extends FWT.IMessage {
  id: string
}

// lazy to implement class
export const Message = {
  createFromApi(mid: string, apiMessage: FWT.IMessage): Message {
    const message: Message = {
      id: mid,
      ...apiMessage,
    }
    return message
  }
}