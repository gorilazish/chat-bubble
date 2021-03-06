import { runInAction, action, observable, autorun } from 'mobx'
import fw from '@newsioaps/firebase-wrapper'
import * as FWT from '@newsioaps/firebase-wrapper/types'
import { Paginator } from '@newsioaps/firebase-wrapper/paginator'
import { RootStore } from 'stores'
import { Message } from '../models'
import * as T from '../types/types'
import Api from '../api'
import Tracker from '../analytics/Tracker'
import persistance from '../lib/persistance'
import { IPostbackEvent } from '../types/types'

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
  @observable private messages: Message[] = []
  @observable private unreadCount: number

  constructor(rootStore: RootStore, persistedState?: T.IPersistedState) {
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

    runInAction(() => {
      this.unreadCount = 0
      this.conversationId = persistedState ? persistedState.conversationId : null
      this.rootStore = rootStore
    })
  }

  public async clearCache(): Promise<void> {
    await persistance.clear()
  }

  public async persistState(): Promise<void> {
    if (this.conversationId) {
      await persistance.setItem('conversationId', this.conversationId, { remote: true })
    } else {
      throw new Error('Persisting incorrect state')
    }
  }

  public getMessages(): Message[] {
    return this.messages
  }

  public getUnreadCount(): number {
    return this.unreadCount
  }

  @action
  public addMessage(uid: string, text: string) {
    const message = {
      id: new Date().getTime().toString(),
      message: text,
      timestamp: Date.now(),
      uid,
    }
    this.messages.push(message)
  }

  public async sendMessage(text: string) {
    if (this.conversationId) {
      const messageId = await this._sendMessage(text)
      Tracker.analyticsSendMessage(this.conversationId, messageId)
      return
    }

    this.addMessage('guest-id', text)
    await this.rootStore.userStore.createGuest()
    const postId = await this.createNewConvo(text)
    this.syncConversation()
    Tracker.analyticsStartConvo(postId)
  }

  // todo: use element index here
  public async sendPostbackEvent(messageId: string, originalPayload: string, value: string) {
    if (this.conversationId) {
      const event: IPostbackEvent = {
        messageId,
        postId: this.conversationId,
        payload: originalPayload,
        sender: { id: this.rootStore.userStore.guest!.id },
        receivers: [{ id: this.rootStore.userStore.receiver!.id }],
        data: {
          value,
        },
      }
      await Api.conversations.sendPostbackEvent(event)
    }
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
          let msgs: Message[] = observable([])
          messages.forEach((msg, mid) => msgs.unshift(Message.createFromApi(mid, msg)))
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
      defaultMessage: this.messages[0].message || '',
    }
    try {
      const conversationId = await Api.conversations.createWidgetConversation(postObject)
      runInAction(() => {
        this.conversationId = conversationId
      })
      this.persistState()
      return conversationId
    } catch (err) {
      runInAction(() => {
        this.messages = this.messages.filter(m => m.uid !== 'guest-id')
      })
      return err
    }
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
