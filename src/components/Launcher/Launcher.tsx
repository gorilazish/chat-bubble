import React, { Component } from 'react'
import ChatWindow from '../ChatWindow'
import { isMobile } from '../../lib/isMobile'
import launcherIcon from '../../assets/bello-logo.svg'
import launcherIconActive from '../../assets/close-icon.svg'


import './Launcher.css'

interface IProps {
  isOpen?: boolean
  showEmoji: boolean
  newMessagesCount?: number
  onMessageWasSent: (messageText: string) => void
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
    this.setState({
      isOpen: !this.state.isOpen,
    })

    if (this.props.handleClick !== undefined) {
      this.props.handleClick()
    }
  }

  public render() {
    const isOpen = this.props.hasOwnProperty('isOpen') ? this.props.isOpen : this.state.isOpen
    const classList = ['sc-launcher', isOpen ? 'opened' : '']

    return (
      <div
        style={{
          position: 'absolute',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          padding: (isMobile && isOpen) ? 0 : 8,
        }}
      >
        <div />
        <ChatWindow
          onUserInputSubmit={this.props.onMessageWasSent}
          isOpen={isOpen}
          onClose={this.handleClick}
          showEmoji={this.props.showEmoji}
        />
        <div className={classList.join(' ')} style={(isMobile && isOpen) ? { display: 'none' } : undefined} onClick={this.handleClick}>
          <MessageCount count={this.props.newMessagesCount} isOpen={isOpen} />
          <img className={'sc-open-icon'} src={launcherIconActive} />
          <img className={'sc-closed-icon'} src={launcherIcon} />
        </div>
      </div>
    )
  }
}

const MessageCount = props => {
  if (props.count === 0 || props.isOpen === true) {
    return null
  }
  return <div className={'sc-new-messsages-count'}>{props.count}</div>
}

export default Launcher
