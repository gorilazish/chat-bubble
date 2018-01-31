import * as React from 'react'
import './App.css'
import { Launcher } from 'react-chat-window'

const mockMessages = [
  {
    author: 'them',
    type: 'text',
    data: {
      text: 'some text',
    },
  },
  {
    author: 'me',
    type: 'text',
    data: {
      text: 'someCode',
    },
  },
]

export interface IMessage {
  message?: string | null
  uid?: string | null
  timestamp: number
  tempUid?: string | null
}

interface IState {
  messageList: any
}

class App extends React.Component<{}, IState> {

  constructor(props) {
    super(props)
    this.state = {
      messageList: mockMessages,
    }
  }

  private _onMessageWasSent(message) {
    this.setState({
      messageList: [...this.state.messageList, message],
    })
  }

  public render() {
    return (
      <div className='App'>
        <Launcher
          agentProfile={{
            teamName: 'react-live-chat',
            imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png',
          }}
          onMessageWasSent={this._onMessageWasSent.bind(this)}
          messageList={this.state.messageList}
          showEmoji
        />
      </div>
    )
  }
}

export default App
