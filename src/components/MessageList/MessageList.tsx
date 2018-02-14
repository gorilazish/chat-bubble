import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import MessageComponent from '../Messages'
import { RootStore, ConversationStore } from '../../stores'

interface IProps {
  convoStore?: ConversationStore
}

@inject((store: RootStore) => ({
  convoStore: store.convoStore,
}))
@observer
class MessageList extends Component<IProps> {
  private scrollList

  public componentDidUpdate(_prevProps, _prevState) {
    this.scrollList.scrollTop = this.scrollList.scrollHeight
  }

  private handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (this.scrollList) {
      const scrollTo = e.deltaY
      this.scrollList.scrollTop = this.scrollList.scrollTop + scrollTo
    }
  }

  public render() {
    const messages = this.props.convoStore!.getMessages()

    return (
      <div
        onWheel={this.handleWheel}
        className="sc-message-list"
        ref={el => (this.scrollList = el)}
      >
        {messages.map((message, i) => {
          return <MessageComponent message={message} key={i} />
        })}
      </div>
    )
  }
}

export default MessageList
