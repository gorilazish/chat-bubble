import React, { Component } from 'react'
import Message from '../Messages'
import { IWidgetMessage } from 'types/types'


interface IProps {
  messages: IWidgetMessage[]
}

class MessageList extends Component<IProps> {
  private scrollList

  public componentDidUpdate(_prevProps, _prevState) {
    this.scrollList.scrollTop = this.scrollList.scrollHeight
  }

  public render() {
    return (
      <div className='sc-message-list' ref={el => this.scrollList = el}>
        {this.props.messages.map((message, i) => {
          return <Message message={message} key={i} />
        })}
      </div>)
  }
}

export default MessageList
