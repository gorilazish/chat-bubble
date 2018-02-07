import * as React from 'react'
import { Launcher } from './components'
import fw from '@newsioaps/firebase-wrapper'
import { Provider } from 'mobx-react'
import { createNewConversation, addComment, mockParticipants, mockUser } from './firebase/conversations'
import { RootStore } from './stores'

type AuthorType = 'me' | 'them'
type MessageType = 'text' | 'code'

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
  unreadCount: number
  isOpen: boolean
}

const isDev = process.env.NODE_ENV === 'development'

class App extends React.Component<{}, IState> {
  constructor(props) {
    super(props)
    this.state = {
      messageList: [],
      conversationId: null, // todo: get conversationId from localStorage/cookie
      subscriber: null,
      unreadCount: 0,
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
    const uid = mockUser.uid
    if (this.state.conversationId) {
      fw.feed.clearUnreadMessages(uid, this.state.conversationId)
    }

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
    this.syncUnreadCount(conversationId)
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

  private syncUnreadCount(conversationId) {
    const uid = mockUser.uid
    fw.feed.syncUnreadMessages(uid, unreadCountByPostId => {
      const unreadCount = unreadCountByPostId[conversationId] || 0
      this.setState({ unreadCount })
    })
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
    return (
      <Provider {...new RootStore()}>
        <Launcher
          showEmoji
          isOpen={this.state.isOpen}
          agentProfile={{
            teamName: 'react-live-chat',
            imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
          }}
          onMessageWasSent={this.onMessageWasSent}
          newMessagesCount={this.state.unreadCount}
          messageList={this.state.messageList}
          handleClick={this.handleLauncherClick}
        />
      </Provider>
    )
  }
}

export default App
