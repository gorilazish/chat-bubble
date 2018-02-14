import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { RootStore, ConversationStore, UserStore } from '../../stores'
import * as FWT from '@newsioaps/firebase-wrapper/types'
import TextMessage from './TextMessage'
import emailMatch from '../../lib/emailRegex'
import chatIconUrl from './../../assets/chat-icon.svg'
import { Message } from '../../models'

import './Message.css'

interface InjectedProps {
  convoStore?: ConversationStore
  userStore?: UserStore
}

interface IState {
  inputValue: string
  validEmail: boolean
}

interface IProps extends InjectedProps {
  message: Message
}

@inject((store: RootStore) => ({
  convoStore: store.convoStore,
  userStore: store.userStore,
}))
@observer
class MessageComponent extends Component<IProps, IState> {
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
      const { id } = this.props.message
      const mid = id
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

  private renderMessageOfType() {
    const { message } = this.props
    if (!!message.template) {
      return this.renderTemplateMessage()
    }

    return <TextMessage text={message.message} />
  }

  private renderTemplateMessage() {
    const message = this.props.message
    const { template } = message
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
        <TextMessage text={message.message} />
        {templateElement}
      </div>
    )
  }

  // todo: temporary implementation
  private renderFullfiledTemplate = () => {
    return (
      <p className={'sc-message--template-success'}>DONE</p>      
    )
  }

  private renderInputTemplate(template: FWT.ITemplate) {
    const { message } = this.props
    return (
      <div className={'sc-message--template-content'}>
        {template.elements.map((elem: FWT.IInputTemplate, idx) => (
          <div key={idx} className={'sc-message--template-element'}>
            {elem.input.label && <p>{elem.input.label}</p>}
            {!!elem.input.value ? (
              this.renderFullfiledTemplate()
            ) : (
              [
                <input
                  key={message.id + message.timestamp}
                  type={'email'}
                  disabled={!!elem.input.value}
                  placeholder={elem.input.placeholder || 'Enter your email'}
                  onChange={this.handleInputChange}
                  value={elem.input.value || this.state.inputValue}
                  onKeyPress={e => this.handleKeyPress(e, elem.input)}
                />,
                <button
                  key={message.timestamp + message.id}
                  onClick={() => this.handlePostbackEvent(elem.input.payload)}
                  style={!this.state.validEmail ? { backgroundColor: 'rgba(240, 16, 101, 0.3)' } : undefined}
                >
                  OK
                </button>,
              ]
            )}
          </div>
        ))}
      </div>
    )
  }

  private isOwnMessage() {
    const { userStore, message } = this.props
    return userStore!.receiver.id !== message.uid
  }

  private getAvatarImage() {
    const { userStore, message } = this.props
    if (userStore && userStore.receiver) {
      return userStore.receiver.id === message.uid ? userStore.receiver.getSmallPhoto() : chatIconUrl
    }

    return chatIconUrl
  }

  public render() {
    const contentClassList = ['sc-message--content', this.isOwnMessage() ? 'sent' : 'received']
    return (
      <div className="sc-message">
        <div className={contentClassList.join(' ')}>
          <div
            className="sc-message--avatar"
            style={{
              backgroundImage: `url(${this.getAvatarImage()})`,
            }}
          />
          <div className={'sc-message--bubble'}>{this.renderMessageOfType()}</div>
        </div>
      </div>
    )
  }
}

export default MessageComponent
