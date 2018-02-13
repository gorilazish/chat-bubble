import React, { Component } from 'react'
import MessageList from '../MessageList'
import UserInput from '../UserInput'
import Header from '../Header'
import { Message } from '../../models'

import './ChatWindow.css'

interface IProps {
  isOpen?: boolean
  showEmoji: boolean
  messageList: Message[]
  onClose: () => void
  onUserInputSubmit: (messageText: string) => void
}

class ChatWindow extends Component<IProps> {
  constructor(props) {
    super(props)
  }

  private onUserInputSubmit = messageText => {
    this.props.onUserInputSubmit(messageText)
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
