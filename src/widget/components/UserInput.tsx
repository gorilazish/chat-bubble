import React, { Component } from 'react'
import SendIcon from './icons/SendIcon'
import EmojiIcon from './icons/EmojiIcon'


interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  showEmoji: boolean
  onSubmit: (message) => void
}

interface IState {
  inputActive: boolean
}

class UserInput extends Component<IProps, IState> {
  private userInput

  constructor(props) {
    super(props)
    this.state = {
      inputActive: false,
    }
  }

  public handleKey = (event) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      this.submitText(event)
    }
  }

  private submitText = (event) => {
    event.preventDefault()
    const text = this.userInput.textContent
    if (text && text.length > 0) {
      this.props.onSubmit({
        author: 'me',
        type: 'text',
        data: { text },
      })
      this.userInput.innerHTML = ''
    }
  }

  private handleEmojiPicked = (emoji) => {
    this.props.onSubmit({
      author: 'me',
      type: 'emoji',
      data: { emoji },
    })
  }

  private handleOnFocus = () => {
    this.setState({ inputActive: true })
  }

  private handleOnBlur = () => {
    this.setState({ inputActive: false })
  }

  public render() {
    return (
      <form className={`sc-user-input ${(this.state.inputActive ? 'active' : '')}`}>
        <div
          role='button'
          tabIndex={0}
          onFocus={this.handleOnFocus}
          onBlur={this.handleOnBlur}
          ref={(e) => { this.userInput = e }}
          onKeyDown={this.handleKey}
          contentEditable={true}
          // placeholder='Write a reply...'
          className='sc-user-input--text'
        >
        </div>
        <div className='sc-user-input--buttons'>
          <div className='sc-user-input--button'></div>
          <div className='sc-user-input--button'>
            {this.props.showEmoji && <EmojiIcon onEmojiPicked={this.handleEmojiPicked} />}
          </div>
          <div className='sc-user-input--button'>
            <SendIcon onClick={this.submitText} />
          </div>
        </div>
      </form>
    )
  }
}


export default UserInput
