import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { RootStore, ConversationStore } from '../../stores'
import * as FWT from '@newsioaps/firebase-wrapper/types'
import TextMessage from './TextMessage'
import EmojiMessage from './EmojiMessage'
import { IWidgetMessage } from '../../types/types'
import emailMatch from '../../lib/emailRegex'
import chatIconUrl from './../../assets/chat-icon.svg'

import './Message.css'


interface InjectedProps {
  convoStore?: ConversationStore
}

interface IState {
  inputValue: string
  validEmail: boolean
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
    validEmail: false,
  }

  private handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>, inputElement: FWT.IInput) => {
    if (e.key == 'Enter' && this.state.validEmail) {
      this.handlePostbackEvent(inputElement.payload)
    }
  }

  private handlePostbackEvent = (payload: string) => {
    if (this.state.inputValue) {
      const { originalMessage } = this.props.message
      const mid = originalMessage.id
      this.props.convoStore!.sendPostbackEvent(mid, payload, this.state.inputValue)
    }
  }

  private handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    this.setState({ inputValue })
    if (emailMatch(inputValue)) {
      this.setState({ validEmail: true })
    } else {
      this.setState({ validEmail: false })
    }
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
      <div className={'sc-message--template-content'}>
        {template.elements.map((elem: FWT.IInputTemplate, idx) => (
          <div key={idx} className={'sc-message--template-element'}>
            {elem.input.label && <p>{elem.input.label}</p>}
            {!!elem.input.value ? <p>{elem.input.value}</p> : [
            <input
              key={elem.input.payload}
              disabled={!!elem.input.value}
              placeholder={elem.input.placeholder || 'Enter your email'}
              onChange={this.handleInputChange}
              value={elem.input.value || this.state.inputValue}
              onKeyPress={(e) => this.handleKeyPress(e, elem.input)}
            />,
            <button
            // todo: use message details for key
              key={elem.input.payload}
              onClick={() => this.handlePostbackEvent(elem.input.payload)}
              style={!this.state.validEmail ? { backgroundColor: 'rgba(240, 16, 101, 0.4)' } : undefined}>
              Submit
            </button>
            ]}
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
          <div className={'sc-message--bubble'}>
            {this.renderMessageOfType(this.props.message.type)}
          </div>
        </div>
      </div>
    )
  }
}

export default Message
