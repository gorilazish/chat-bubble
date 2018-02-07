import * as React from 'react'
import { Launcher } from './components'
import * as T from '@newsioaps/firebase-wrapper/types'
import { observer, inject } from 'mobx-react'
import { UserStore, RootStore, ConversationStore } from './stores'
import poster from './lib/poster'

type AuthorType = 'me' | 'them'
type MessageType = 'text'

interface IWidgetMessage {
  author: AuthorType
  type: MessageType
  data: {
    text: string
  }
}

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
      type: 'text',
      data: {
        text: comment.message || '',
      },
    }
  }

  private handleSendMessage = message => {
    const messageText = message.data.text || message.data.code
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
