import React, { Component } from 'react'
import { EmojiIcon, SendIcon } from '../icons'

import './UserInput.css'


interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  showEmoji: boolean
  onSubmit: (text) => void
}

interface IState {
  inputActive: boolean
  value: string
}

class UserInput extends Component<IProps, IState> {

  constructor(props) {
    super(props)
    this.state = {
      inputActive: false,
      value: '',
    }
  }

  public handleKey = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.submitText(event)
    }
  }

  private submitText = (event) => {
    event.preventDefault()
    const text = this.state.value
    if (text && text.length > 0) {
      this.props.onSubmit(text)
      this.setState({ value: '' })
    }
  }

  private handleEmojiPicked = (emoji) => {
    this.props.onSubmit({
      author: 'me',
      type: 'emoji',
      data: { emoji },
    })
  }

  private handleChange = (e) => {
    this.setState({ value: e.target.value })
  }

  private handleOnFocus = () => {
    this.setState({ inputActive: true })
  }

  private handleOnBlur = () => {
    this.setState({ inputActive: false })
  }

  public render() {
    return (
      <div className={`sc-user-input ${(this.state.inputActive ? 'active' : '')}`}>
        <input
          tabIndex={0}
          value={this.state.value}
          onChange={this.handleChange}
          onFocus={this.handleOnFocus}
          onBlur={this.handleOnBlur}
          onKeyDown={this.handleKey}
          placeholder='Write a reply...'
          className='sc-user-input--text'
        />
        <div className='sc-user-input--buttons'>
          {this.props.showEmoji && 
            <div className='sc-user-input--button'>
              <EmojiIcon onEmojiPicked={this.handleEmojiPicked} />
            </div>}
          <div className='sc-user-input--button'>
            <SendIcon onClick={this.submitText} />
          </div>
        </div>
      </div>
    )
  }
}


export default UserInput
