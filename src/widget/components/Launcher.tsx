import React, { Component } from 'react'
import ChatWindow from './ChatWindow'
// import launcherIcon from './../assets/logo-no-bg.svg'
// import launcherIconActive from './../assets/close-icon.png'
import { IWidgetMessage, IAgentProfile } from 'types'

const launcherIcon = require('./../assets/logo-no-bg.svg')
const launcherIconActive = require('./../assets/close-icon.png')

interface IProps {
  isOpen?: boolean
  showEmoji: boolean
  newMessagesCount?: number
  messageList: IWidgetMessage[]
  agentProfile: IAgentProfile
  onMessageWasSent: (message: IWidgetMessage) => void
  handleClick?: () => void
}

interface IState {
  isOpen: boolean
  launcherIcon: string
}

class Launcher extends Component<IProps, IState> {

  constructor(props) {
    super(props)
    this.state = {
      launcherIcon,
      isOpen: false,
    }
  }

  private handleClick = () => {
    if (this.props.handleClick !== undefined) {
      this.props.handleClick()
    } else {
      this.setState({
        isOpen: !this.state.isOpen,
      })
    }
  }

  public render() {
    const isOpen = this.props.hasOwnProperty('isOpen') ? this.props.isOpen : this.state.isOpen
    const classList = [
      'sc-launcher',
      (isOpen ? 'opened' : ''),
    ]
    return (
      <div>
        <div>
        </div>
        <div className={classList.join(' ')} onClick={this.handleClick.bind(this)}>
          <MessageCount count={this.props.newMessagesCount} isOpen={isOpen} />
          <img className={'sc-open-icon'} src={launcherIconActive} />
          <img className={'sc-closed-icon'} src={launcherIcon} />
        </div>
        <ChatWindow
          messageList={this.props.messageList}
          onUserInputSubmit={this.props.onMessageWasSent}
          agentProfile={this.props.agentProfile}
          isOpen={isOpen}
          onClose={this.handleClick.bind(this)}
          showEmoji={this.props.showEmoji}
        />
      </div>
    )
  }
}

const MessageCount = (props) => {
  if (props.count === 0 || props.isOpen === true) { return null }
  return (
    <div className={'sc-new-messsages-count'}>
      {props.count}
    </div>
  )
}


export default Launcher
