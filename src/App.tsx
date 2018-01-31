import * as React from 'react'
import { Launcher } from 'react-chat-window'
import { createNewConversation, mockParticipants } from './firebase/conversations'


interface IState {
  messageList: any
}

class App extends React.Component<{}, IState> {

  constructor(props) {
    super(props)
    this.state = {
      messageList: [],
    }
  }

  private _onMessageWasSent(message) {
    const postOpts = {
      participants: mockParticipants,
      title: 'Widget lead',
    }
    createNewConversation(postOpts, message.data.text || message.data.code)
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
