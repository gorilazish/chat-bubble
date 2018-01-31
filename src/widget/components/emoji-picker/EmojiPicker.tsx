import React, { Component } from 'react'
import EmojiConvertor from 'emoji-js'
import emojiData from './emojiData'

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  onEmojiPicked: (emoji: string) => void
}

class EmojiPicker extends Component<IProps> {
  private emojiConvertor: any
  private domNode: any // not sure about type here

  constructor(props) {
    super(props)
    this.emojiConvertor = new EmojiConvertor()
    this.emojiConvertor.init_env()
  }

  public componentDidMount() {
    const elem = this.domNode
    elem.style.opacity = 0
    window.requestAnimationFrame(() => {
      elem.style.transition = 'opacity 350ms'
      elem.style.opacity = 1
    })
    this.domNode.focus()
  }

  public render() {
    return (
      <div
        tabIndex={0}
        onBlur={this.props.onBlur}
        className={'sc-emoji-picker'}
        ref={(e) => { this.domNode = e }}
      >
        <div className={'sc-emoji-picker--content'}>
          {emojiData.map((category) => {
            return (
              <div className={'sc-emoji-picker--category'} key={category.name}>
                <div className={'sc-emoji-picker--category-title'}>{category.name}</div>
                {category.emojis.map((emoji) => {
                  return (
                    <span
                      key={emoji}
                      className={'sc-emoji-picker--emoji'}
                      onClick={() => {
                        this.props.onEmojiPicked(emoji)
                        this.domNode.blur()
                      }}
                    >
                      {emoji}
                    </span>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}

export default EmojiPicker
