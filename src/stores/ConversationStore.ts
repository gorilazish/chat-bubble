import { runInAction, observable, autorun } from 'mobx'
import fw from '@newsioaps/firebase-wrapper'
import * as FWT from '@newsioaps/firebase-wrapper/types'
import { Paginator } from '@newsioaps/firebase-wrapper/paginator'
import { RootStore } from 'stores'
import * as T from '../types'
import Tracker from '../analytics/Tracker'

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
  private subscriber: Paginator<FWT.IMessage> | null
  @observable private conversationId: string | null
  @observable private messages: FWT.IMessage[] = []

  constructor(rootStore: RootStore, persistedState: T.IPersistedState) {
    this.rootStore = rootStore
    this.conversationId = persistedState ? persistedState.conversationId : null
    
    autorun(() => {
      if (this.conversationId) {
        this.syncConversation(this.conversationId)
      } else {
        if (this.subscriber) {
          this.subscriber.stop()
        }
      }
    })
  }

  public getMessages(): FWT.IMessage[] {
    return this.messages
  }

  public async sendMessage(text: string) {
    if (this.conversationId) {
      const messageId = await this._sendMessage(this.conversationId, text)
      Tracker.analyticsSendMessage(this.conversationId, messageId)
      return
    }

    try {
      const postId = await this.createNewConvoAndSendMessage(text)
      this.conversationId = postId
      localStorage.setItem('BelloWidgetState', JSON.stringify({ conversationId: postId }))
      this.syncConversation(postId)
    } catch (err) {
      console.log(err)
    }
  }

  private syncConversation(conversationId) {
    // todo: implement pagination
    this.subscriber = fw.conversations.paginateMessages(conversationId, messages => {
      runInAction(() => {
        let msgs: FWT.IMessage[] = []
        messages.forEach(msg => msgs.unshift(msg))
        this.messages = msgs
      })
    })
  }

  private async createNewConvoAndSendMessage(text: string) {
    const postId = await this.createNewConvo()
    const messageId = await this._sendMessage(postId, text)
    Tracker.analyticsIdentify(this.rootStore.userStore.guest!)
    Tracker.analyticsStartConvo(postId, messageId)
    return postId || null
  }

  private createNewConvo(): Promise<string> {
    const guest = this.rootStore.userStore.guest!
    const receiver = this.rootStore.userStore.receiver
    const postObject: ICreatePostOptions = {
      participants: [{ id: receiver.id, type: 'user' }],
      title: 'Widget Contact Request',
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
