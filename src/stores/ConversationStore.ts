import { runInAction, observable, autorun } from 'mobx'
import fw from '@newsioaps/firebase-wrapper'
import * as FWT from '@newsioaps/firebase-wrapper/types'
import { Paginator } from '@newsioaps/firebase-wrapper/paginator'
import { RootStore } from 'stores'
import * as T from '../types/types'
import Api from '../api'
import Tracker from '../analytics/Tracker'
import persistance from '../lib/persistance'
import { IMessageEventPayload } from '../types/types'


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

  constructor(rootStore: RootStore, persistedState?: T.IPersistedState) {
    this.rootStore = rootStore
    this.conversationId = persistedState ? persistedState.conversationId : null
    this.unreadCount = 0
    this.messages = [{
      message: defaultMessageText,
      uid: 'fakeId',
      timestamp: Date.now(),
    }]

    autorun(async () => {
      if (this.conversationId && this.rootStore.userStore.guest && this.rootStore.userStore.receiver) {
        this.syncConversation()
        this.syncUnreadCount()
      } else {
        if (this.subscriber) {
          this.stopSync()
        }
      }
    })
  }

  public async clearCache(): Promise<void> {
    await persistance.clear()
  }

  public async persistState(): Promise<void> {
    if (this.conversationId) {
      await persistance.setItem('BelloWidgetState', { conversationId: this.conversationId })
    } else {
      throw new Error('Persisting incorrect state')
    }
  }

  public getMessages(): FWT.IMessage[] {
    return this.messages
  }

  public getUnreadCount(): number {
    return this.unreadCount
  }

  public async sendMessage(text: string) {
    if (this.conversationId) {
      const messageId = await this._sendMessage(text)
      Tracker.analyticsSendMessage(this.conversationId, messageId)
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

    addOptimisticMessage(text)
    await this.rootStore.userStore.createGuest()
    const postId = await this.createNewConvo(text)
    const messageId = await this._sendMessage(text)
    this.syncConversation()
    Tracker.analyticsStartConvo(postId, messageId)
  }

  public sendMessageEventPayload(event, value) {
    const payload: IMessageEventPayload = {
      event,
      sender: { id: this.rootStore.userStore.guest!.id },
      receivers: [{ id: this.rootStore.userStore.receiver!.id }],
      postback: {
        value
      }
    }
    Api.conversations.sendMessageEventPayload(payload)
  }

  public clearUnreadMessages() {
    const guest = this.rootStore.userStore.guest
    if (guest && this.conversationId) {
      fw.feed.clearUnreadMessages(guest.id, this.conversationId)
    }
  }

  private syncConversation() {
    // todo: implement pagination
    if (this.conversationId) {
      this.subscriber = fw.conversations.paginateMessages(this.conversationId, messages => {
        runInAction(() => {
          let msgs: FWT.IMessage[] = []
          messages.forEach(msg => msgs.unshift(msg))
          this.messages = msgs
        })
      })
    }
  }

  private async createNewConvo(text: string): Promise<string> {
    const guestId = this.rootStore.userStore.guest!.id
    const receiverId = this.rootStore.userStore.receiver.id
    const postObject: T.ICreateConversationBody = {
      receiverId,
      senderId: guestId,
      message: text,
      defaultMessage: defaultMessageText,
    }
    const conversationId = await Api.conversations.createWidgetConversation(postObject)
    runInAction(() => {
      this.conversationId = conversationId
    })
    this.persistState()
    return conversationId
  }

  private async _sendMessage(text: string): Promise<string> {
    const commentObject: ISendMessageOption = {
      uid: this.rootStore.userStore.guest!.id,
      postId: this.conversationId!,
      message: text,
    }
    return fw.conversations.sendMessage(commentObject)
  }

  private syncUnreadCount() {
    if (this.conversationId) {
      const guestId = this.rootStore.userStore.guest!.id
      this.unreadCountSubscriber = fw.feed.syncUnreadMessages(guestId, unreadCountByPostId => {
        runInAction(() => {
          this.unreadCount = unreadCountByPostId[this.conversationId!] || 0
        })
      })
    }
  }

  private stopSync() {
    this.subscriber!.stop()
    this.unreadCountSubscriber!()
    this.subscriber = null
    this.unreadCountSubscriber = null
  }
}
