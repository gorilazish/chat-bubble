import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { RootStore, ConversationStore } from '../../stores'
import * as FWT from '@newsioaps/firebase-wrapper/types'
import TextMessage from './TextMessage'
import EmojiMessage from './EmojiMessage'
import { IWidgetMessage } from '../../types/types'
import chatIconUrl from './../../assets/chat-icon.svg'

import './Message.css'

interface InjectedProps {
  convoStore?: ConversationStore
}

interface IState {
  inputValue: string
}

interface IProps extends InjectedProps {
  message: IWidgetMessage
}

@inject((store: RootStore) => ({
  convoStore: store.convoStore,
}))
@observer
class Message extends Component<IProps, IState> {
  state: IState = {
    inputValue: '',
  }

  private handlePostbackEvent = (_e: React.MouseEvent<HTMLButtonElement>, payload: string) => {
    if (this.state.inputValue) {
      const { originalMessage } = this.props.message
      const mid = originalMessage.id
      this.props.convoStore!.sendPostbackEvent(mid, payload, this.state.inputValue)
    }
  }

  private handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value })
  }

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
    const templateType = template!.type

    switch (templateType) {
      case 'input':
        templateElement = this.renderInputTemplate(template!)
        break
      default:
        templateElement = <p>[Template type: {templateType} is not supported]</p>
    }

    return (
      <div>
        <TextMessage {...rest} />
        {templateElement}
      </div>
    )
  }

  private renderInputTemplate(template: FWT.ITemplate) {
    return (
      <div>
        {template.elements.map((elem: FWT.IInputTemplate, idx) => (
          <div key={idx}>
            {elem.input.label && <p>{elem.input.label}</p>}
            <input
              disabled={!!elem.input.value}
              placeholder={elem.input.placeholder}
              onChange={this.handleInputChange}
              value={elem.input.value || this.state.inputValue}
            />
            {!elem.input.value && <button onClick={e => this.handlePostbackEvent(e, elem.input.payload)}>OK</button>}
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
