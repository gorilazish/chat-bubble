import React, { Component } from 'react'
import TextMessage from './TextMessage'
import EmojiMessage from './EmojiMessage'
import { IWidgetMessage } from '../../types/types'
import chatIconUrl from './../../assets/chat-icon.svg'

import './Message.css'


interface IProps {
  message: IWidgetMessage
}

class Message extends Component<IProps> {

  private renderMessageOfType(type) {
    switch (type) {
      case 'text':
        return <TextMessage {...this.props.message} />
      case 'emoji':
        return <EmojiMessage {...this.props.message} />

      default:
        return
    }
  }

  public render() {
    const contentClassList = [
      'sc-message--content',
      (this.props.message.author === 'me' ? 'sent' : 'received'),
    ]
    return (
      <div className='sc-message'>
        <div className={contentClassList.join(' ')}>
          <div className='sc-message--avatar' style={{
            backgroundImage: `url(${chatIconUrl})`,
          }}></div>
          {this.renderMessageOfType(this.props.message.type)}
        </div>
      </div>)
  }
}

export default Message
