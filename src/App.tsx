import * as React from 'react'
import { Launcher } from './components'
import * as T from '@newsioaps/firebase-wrapper/types'
import { observer, inject } from 'mobx-react'
import { UserStore, RootStore, ConversationStore } from './stores'
import poster from './lib/poster'
import { IWidgetMessage } from './types/types'

interface InjectedProps {
  userStore?: UserStore
  convoStore?: ConversationStore
}

interface IState {
  isOpen: boolean
}

@inject((store: RootStore) => ({
  userStore: store.userStore,
  convoStore: store.convoStore,
}))
@observer
class App extends React.Component<InjectedProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: false,
    }
  }

  private handleLauncherClick = () => {
    this.props.convoStore!.clearUnreadMessages()

    this.setState(state => {
      const width = !state.isOpen ? '400px' : '80px'
      const height = !state.isOpen ? '400px' : '80px'
      // it's delayed because of the animations
      window.setTimeout(() => {
        this.sendLauncherTogglEvent({ width, height })
      }, !state.isOpen ? 0 : 300)

      return { isOpen: !state.isOpen }
    })
  }

  private sendLauncherTogglEvent = (opts: { width: string; height: string }) => {
    // todo: event data type safety would be nice...
    poster.sendMessage('toggle', {
      width: opts.width,
      height: opts.height,
    })
  }

  private transformMessages = (messages: T.IMessage[]): IWidgetMessage[] => {
    return messages.map(this.transformMessage)
  }

  private transformMessage = (comment: T.IMessage): IWidgetMessage => {
    const isOwnMessage = comment.uid === this.props.userStore!.guest!.id
    return {
      author: isOwnMessage ? 'me' : 'them',
      type: comment.template ? 'templateMessage' : 'text',
      data: {
        text: comment.message || '',
      },
      template: comment.template ? comment.template : null
    }
  }

  private handleSendMessage = message => {
    const messageText = message.data.text || message.data.emoji
    this.props.convoStore!.sendMessage(messageText)
  }

  public render() {
    const userStore = this.props.userStore!
    const convoStore = this.props.convoStore!

    if (!userStore.hasLoadedReceiver || !userStore.hasLoadedGuest) {
      return null
    }

    if (userStore.hasLoadedReceiver && !userStore.receiver) {
      console.error('Cannot load receiving user state. User does not exist')
      return null
    }

    return (
      <Launcher
        showEmoji
        isOpen={this.state.isOpen}
        newMessagesCount={convoStore.getUnreadCount()}
        onMessageWasSent={this.handleSendMessage}
        messageList={this.transformMessages(convoStore.getMessages())}
        handleClick={this.handleLauncherClick}
      />
    )
  }
}

export default App
