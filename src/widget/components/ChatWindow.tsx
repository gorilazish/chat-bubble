import React, { Component } from 'react'
import MessageList from './MessageList'
import UserInput from './UserInput'
import Header from './Header'
import { IWidgetMessage } from '../../types'

interface IProps {
  isOpen?: boolean
  showEmoji: boolean
  messageList: IWidgetMessage[]
  onClose: () => void
  onUserInputSubmit: (message: IWidgetMessage) => void
}

interface IState {
  messages: IWidgetMessage[]
}

class ChatWindow extends Component<IProps, IState> {
  constructor(props) {
    super(props)
  }

  private onUserInputSubmit = message => {
    this.props.onUserInputSubmit(message)
  }

  public onMessageReceived = message => {
    this.setState({ messages: [...this.state.messages, message] })
  }

  public render() {
    const messageList = this.props.messageList || []
    const classList = ['sc-chat-window', this.props.isOpen ? 'opened' : 'closed']
    return (
      <div className={classList.join(' ')}>
        <Header onClose={this.props.onClose} />
        <MessageList messages={messageList} />
        <UserInput showEmoji={this.props.showEmoji} onSubmit={this.onUserInputSubmit} />
      </div>
    )
  }
}

export default ChatWindow
