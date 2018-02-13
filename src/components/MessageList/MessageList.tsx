import React, { Component } from 'react'
import MessageComponent from '../Messages'
import { Message } from '../../models'


interface IProps {
  messages: Message[]
}

class MessageList extends Component<IProps> {
  private scrollList

  public componentDidUpdate(_prevProps, _prevState) {
    this.scrollList.scrollTop = this.scrollList.scrollHeight
  }

  public render() {
    return (
      <div className="sc-message-list" ref={el => (this.scrollList = el)}>
        {this.props.messages.map((message, i) => {
          return <MessageComponent message={message} key={i} />
        })}
      </div>
    )
  }
}

export default MessageList
