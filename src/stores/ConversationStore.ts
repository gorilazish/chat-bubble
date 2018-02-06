import { runInAction, observable } from 'mobx'
import { RootStore } from 'stores'
import fw from '@newsioaps/firebase-wrapper'
import * as T from '@newsioaps/firebase-wrapper/types'
import { Paginator } from '@newsioaps/firebase-wrapper/paginator'

export interface ICreatePostOptions {
  participants: IParticipant[]
  title: string
  id?: string
}

export interface ISendMessageOption {
  message?: string | null
  id?: string
  uid?: string | null
  tempUid?: string | null
  postId: string
}

export interface IParticipant {
  id: string
  type: 'group' | 'user' | 'tempUser'
}

export class ConversationStore {
  // @ts-ignore
  private rootStore: RootStore
  // @ts-ignore
  private subscriber: Paginator<T.IMessage>
  private conversationId: string | null
  @observable private messages: T.IMessage[] = []

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
  }

  // getters

  public getMessages(): T.IMessage[] {
    return this.messages
  }

  // actions

  private syncConversation(conversationId) {
    this.subscriber = fw.conversations.paginateMessages(conversationId, messages => {
      runInAction(() => {
        let msgs: T.IMessage[] = []
        messages.forEach(msg => msgs.unshift(msg))
        this.messages = msgs
      })
    })
  }

  // create temp user
  public async sendMessage(text: string) {
    if (this.conversationId) {
      this._sendMessage(this.conversationId, text)
      return
    }

    try {
      const postId = await this.createNewConvoAndSendMessage(text)
      this.conversationId = postId
      this.syncConversation(postId)
    } catch (err) {
      console.log(err)
    }
  }

  private async createNewConvoAndSendMessage(text: string) {
    this.rootStore.userStore.createGuest()
    const postId = await this.createNewConvo()
    await this._sendMessage(postId, text)
    return postId || null
  }

  private createNewConvo(): Promise<string> {
    const guest = this.rootStore.userStore.guest!
    const receiver = this.rootStore.userStore.receiver
    const postObject: ICreatePostOptions = {
      participants: [{ id: receiver.id, type: 'user' }],
      title: 'Widget lead',
    }
    return fw.posts.addPost(guest.id, postObject)
  }

  private _sendMessage(postId, text: string) {
    const commentObject: ISendMessageOption = {
      uid: this.rootStore.userStore.guest!.id,
      postId,
      message: text,
    }
    try {
      return fw.conversations.sendMessage(commentObject)
    } catch (e) {
      return console.error(e)
    }
  }
}
