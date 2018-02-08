import { runInAction, observable, autorun } from 'mobx'
import fw from '@newsioaps/firebase-wrapper'
import * as FWT from '@newsioaps/firebase-wrapper/types'
import { Paginator } from '@newsioaps/firebase-wrapper/paginator'
import { RootStore } from 'stores'
import * as T from '../types/types'
import Tracker from '../analytics/Tracker'
import persistance from '../lib/persistance'

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
      const messageId = await this._sendMessage(this.conversationId, text)
      Tracker.analyticsSendMessage(this.conversationId, messageId)
      return
    }

    try {
      const postId = await this.createNewConvoAndSendMessage(text)
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

  private async createNewConvoAndSendMessage(text: string) {
    const postId = await this.createNewConvo()
    const messageId = await this._sendMessage(postId, text)
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

  private syncUnreadCount(conversationId) {
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
