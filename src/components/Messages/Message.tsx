import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { RootStore, ConversationStore } from '../../stores'
import TextMessage from './TextMessage'
import EmojiMessage from './EmojiMessage'
import { IWidgetMessage } from '../../types/types'
import chatIconUrl from './../../assets/chat-icon.svg'

import './Message.css'


interface InjectedProps {
  convoStore?: ConversationStore
}

interface IProps extends InjectedProps {
  message: IWidgetMessage
}

@inject((store: RootStore) => ({
  convoStore: store.convoStore,
}))
@observer
class Message extends Component<IProps> {
  private renderMessageOfType(type) {
    switch (type) {
      case 'text':
        return <TextMessage {...this.props.message} />
      case 'emoji':
        return <EmojiMessage {...this.props.message} />
      case 'templateMessage':
        return this.renderTemplateMessage()
      default:
        return
    }
  }

  private renderTemplateMessage() {
    const message = this.props.message
    const { template, ...rest } = message
    let templateElement

    switch(template!.type) {
      case 'input':
        templateElement = this.renderInputTemplate(template)
    }

    return (
      <div>
        <TextMessage {...rest} />
        {templateElement}
      </div>
    )
  }

  private handleMessageEvent = (e, templateEvent) => {
    this.props.convoStore!.sendMessageEventPayload(templateEvent, e.target.value)
  }

  private renderInputTemplate(template) {
    return (
      <div>
        <p>{template.title}</p>
        {template.elements.map(elem => (
          <div>
            {elem.input.label && <p>{elem.input.label}</p>}
            <input key={elem.input.placeholder} placeholder={elem.input.placeholder} onBlur={(e) => this.handleMessageEvent(e, elem.input.action)} />
          </div>
        ))}
      </div>
    )
  }

  public render() {
    const contentClassList = ['sc-message--content', this.props.message.author === 'me' ? 'sent' : 'received']
    return (
      <div className="sc-message">
        <div className={contentClassList.join(' ')}>
          <div
            className="sc-message--avatar"
            style={{
              backgroundImage: `url(${this.props.message.authorImage || chatIconUrl})`,
            }}
          />
          {this.renderMessageOfType(this.props.message.type)}
        </div>
      </div>
    )
  }
}

export default Message
