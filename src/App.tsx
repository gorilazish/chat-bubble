import * as React from 'react'
import { Launcher } from './components'
import fw from '@newsioaps/firebase-wrapper'
import { createNewConversation, addComment, mockParticipants, mockUser } from './firebase/conversations'

type AuthorType = 'me' | 'them'
type MessageType = 'text' | 'code'

interface IWidgetMessage {
  author: AuthorType
  type: MessageType,
  data: {
    text: string
  }
}

interface IState {
  messageList: any
  conversationId: string | null
  subscriber: any
  unreadCount: number
}

class App extends React.Component<{}, IState> {

  constructor(props) {
    super(props)
    this.state = {
      messageList: [],
      conversationId: null, // todo: get conversationId from localStorage/cookie
      subscriber: null,
      unreadCount: 0,
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
    const subscriber =  fw.conversations.paginateMessages(conversationId, feed => {
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

  private handleLauncherClick = (_e) => {
    const uid = mockUser.uid
    if (this.state.conversationId) {
      fw.feed.clearUnreadMessages(uid, this.state.conversationId)
    }
  }

  private onMessageWasSent = (message) => {
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
      <div className='App'>
        <Launcher
          agentProfile={{
            teamName: 'react-live-chat',
            imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
          }}
          onMessageWasSent={this.onMessageWasSent}
          newMessagesCount={this.state.unreadCount}
          messageList={this.state.messageList}
          showEmoji
          handleClick={this.handleLauncherClick}
        />
      </div>
    )
  }
}

export default App
