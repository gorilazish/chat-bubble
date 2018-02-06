import * as React from 'react'
import { Launcher } from './widget'
import fw from '@newsioaps/firebase-wrapper'
import { observer, inject } from 'mobx-react'
import { createNewConversation, addComment, mockParticipants, mockUser } from './firebase/conversations'
import { UserStore, RootStore } from './stores'

type AuthorType = 'me' | 'them'
type MessageType = 'text' | 'code'

interface InjectedProps {
  userStore?: UserStore
}

interface IWidgetMessage {
  author: AuthorType
  type: MessageType
  data: {
    text: string
  }
}

interface IState {
  messageList: any
  conversationId: string | null
  subscriber: any
  isOpen: boolean
}

const isDev = process.env.NODE_ENV === 'development'

@inject((store: RootStore) => ({
  userStore: store.userStore,
}))
@observer
class App extends React.Component<InjectedProps, IState> {
  constructor(props) {
    super(props)
    this.state = {
      messageList: [],
      conversationId: null, // todo: get conversationId from localStorage/cookie
      subscriber: null,
      isOpen: false,
    }
  }

  public componentWillMount() {
    if (this.state.conversationId) {
      this.syncConversation(this.state.conversationId)
    }
  }

  public componentWillUnmount() {
    if (this.state.subscriber) {
      this.state.subscriber.stop()
    }
  }

  private handleLauncherClick = () => {
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
    const receiverWindow = isDev ? window : window.parent
    // todo: event data type safety would be nice...
    const message = {
      name: 'toggle',
      width: opts.width,
      height: opts.height,
    }
    receiverWindow.postMessage(message, '*')
  }

  private createMessageFromApi(comment): IWidgetMessage {
    const isOwnMessage = comment.uid === mockUser.uid
    return {
      author: isOwnMessage ? 'me' : 'them',
      type: 'text',
      data: {
        text: comment.message,
      },
    }
  }

  private syncConversation(conversationId) {
    const subscriber = fw.conversations.paginateMessages(conversationId, feed => {
      const messageList: IWidgetMessage[] = []
      feed.forEach((comment, _id) => {
        const widgetMessage = this.createMessageFromApi(comment)
        messageList.unshift(widgetMessage)
      })

      this.setState({ messageList })
    })
    this.setState({ subscriber })
  }

  private onMessageWasSent = message => {
    const messageText = message.data.text || message.data.code

    // create temp user
    if (!this.state.conversationId) {
      const postOpts = {
        participants: mockParticipants,
        title: 'Widget lead',
      }

      createNewConversation(postOpts, messageText)
        .then(postId => {
          this.setState({ conversationId: postId })
          this.syncConversation(postId)
        })
        .catch(e => console.error(e))
    } else {
      addComment(this.state.conversationId, messageText)
    }

    this.setState({
      messageList: [...this.state.messageList, message],
    })
  }

  public render() {
    const userStore = this.props.userStore!

    if (!userStore.hasLoaded) {
      return null
    }

    if (userStore.hasLoaded && !userStore.receiver) {
      console.error('Cannot load receiving user state. User does not exist')
      return null
    }

    return (
      <Launcher
        showEmoji
        isOpen={this.state.isOpen}
        onMessageWasSent={this.onMessageWasSent}
        messageList={this.state.messageList}
        handleClick={this.handleLauncherClick}
      />
    )
  }
}

export default App
