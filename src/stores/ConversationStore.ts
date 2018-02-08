import { runInAction, observable, autorun } from 'mobx'
import fw from '@newsioaps/firebase-wrapper'
import * as FWT from '@newsioaps/firebase-wrapper/types'
import { Paginator } from '@newsioaps/firebase-wrapper/paginator'
import { RootStore } from 'stores'
import persistance from '../lib/persistance'
import * as T from '../types/types'
import Api from '../api'

const defaultMessageText = 'Hey, how can I help you?' // todo: not sure where to put it. Could be also taken from config?

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
  private unreadCountSubscriber: (() => void) | null
  @observable private conversationId: string | null
  @observable private messages: FWT.IMessage[] = []
  @observable private unreadCount: number

  constructor(rootStore: RootStore, persistedState: T.IPersistedState) {
    this.rootStore = rootStore
    this.conversationId = persistedState ? persistedState.conversationId : null
    this.unreadCount = 0
    this.messages = [{
      message: defaultMessageText,
      uid: 'fakeId',
      timestamp: Date.now(),
    }]
    
    autorun(() => {
      if (this.conversationId) {
        this.syncConversation(this.conversationId)
        this.syncUnreadCount(this.conversationId)
      } else {
        if (this.subscriber) {
          this.stopSync()
        }
      }
    })
  }

  public getMessages(): FWT.IMessage[] {
    return this.messages
  }

  public getUnreadCount(): number {
    return this.unreadCount
  }

  public async sendMessage(text: string) {
    if (this.conversationId) {
      this._sendMessage(this.conversationId, text)
      return
    }

    const addOptimisticMessage = (text: string) => {
      const optimisticMessage = {
        message: text,
        uid: this.rootStore.userStore.guest!.id,
        timestamp: Date.now(),
      }

      this.messages.push(optimisticMessage)      
    }

    // new conversation
    try {
      addOptimisticMessage(text)
      const postId = await this.createNewConvo(text)
      this.conversationId = postId
      persistance.setItem('BelloWidgetState', { conversationId: postId })
      this.syncConversation(postId)
    } catch (err) {
      console.log(err)
    }
  }

  public clearUnreadMessages() {
    const guestId = this.rootStore.userStore.guest!.id
    if (guestId && this.conversationId) {
      fw.feed.clearUnreadMessages(guestId, this.conversationId)
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

  private createNewConvo(text: string): Promise<string> {
    const guestId = this.rootStore.userStore.guest!.id
    const receiverId = this.rootStore.userStore.receiver.id
    const postObject: T.ICreateConversationBody = {
      receiverId,
      senderId: guestId,
      message: text,
      defaultMessage: defaultMessageText,
    }
    
    return Api.conversations.createWidgetConversation(postObject)
  }

  private _sendMessage(postId: string, text: string) {
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

  private syncUnreadCount(conversationId: string) {
    const guestId = this.rootStore.userStore.guest!.id
    this.unreadCountSubscriber = fw.feed.syncUnreadMessages(guestId, unreadCountByPostId => {
      runInAction(() => {
        this.unreadCount = unreadCountByPostId[conversationId] || 0
      })
    })
  }

  private stopSync() {
    this.subscriber!.stop()
    this.unreadCountSubscriber!()
    this.subscriber = null
    this.unreadCountSubscriber = null
  }
}
