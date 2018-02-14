import React, { Component } from 'react'
import MessageList from '../MessageList'
import UserInput from '../UserInput'
import Header from '../Header'
import { isMobile } from '../../lib/isMobile'

import './ChatWindow.css'

interface IProps {
  isOpen?: boolean
  showEmoji: boolean
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
    const classList = ['sc-chat-window', this.props.isOpen ? 'opened' : 'closed']
    return (
      <div
        onWheel={e => {
          e.preventDefault()
        }}
        className={classList.join(' ')}
        style={
          isMobile
            ? {
                position: 'fixed',
                height: '100%',
                zIndex: 1,
                borderRadius: 0,
              }
            : undefined
        }
      >
        <Header onClose={this.props.onClose} />
        <MessageList />
        <UserInput showEmoji={this.props.showEmoji} onSubmit={this.onUserInputSubmit} />
      </div>
    )
  }
}

export default ChatWindow
