import * as React from 'react'
import { Launcher } from './components'
import { observer, inject } from 'mobx-react'
import { UserStore, RootStore, ConversationStore } from './stores'
import { Message } from './models'
import * as Types from './types/types'
import poster from './lib/poster'

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
      // it's delayed because of the animations
      window.setTimeout(() => {
        this.sendLauncherTogglEvent()
      }, !state.isOpen ? 0 : 300)

      return { isOpen: !state.isOpen }
    })
  }

  private sendLauncherTogglEvent = () => {
    // todo: event data type safety would be nice...
    poster.sendMessage('toggle')
  }

  private transformMessages = (messages: Message[]): Types.IWidgetMessage[] => {
    return messages.map(this.transformMessage)
  }

  private transformMessage = (message: Message): Types.IWidgetMessage => {
    const guest = this.props.userStore!.guest
    const receiver = this.props.userStore!.receiver
    const isOwnMessage = guest ? message.uid === guest.id : false
    return {
      author: isOwnMessage ? 'me' : 'them',
      type: message.template ? 'templateMessage' : 'text',
      authorImage: !isOwnMessage ? receiver.getSmallPhoto() : undefined,
      data: {
        text: message.message || '',
      },
      template: message.template ? message.template : null,
      originalMessage: message,
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
        showEmoji={false}
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
