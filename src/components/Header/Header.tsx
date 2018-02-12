import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import { RootStore, UserStore } from '../../stores'
import closeIcon from '../../assets/close-icon.svg'

import './Header.css'

interface OwnProps {
  onClose: () => void
}

interface InjectProps {
  userStore?: UserStore
}

@inject((stores: RootStore) => ({
  userStore: stores.userStore,
}))
@observer
class Header extends Component<OwnProps & InjectProps> {
  public render() {
    const userStore = this.props.userStore!
    const receiverUser = userStore.receiver

    if (!receiverUser) {
      return null
    }

    const imageUrl = receiverUser.getSmallPhoto()
    const name = receiverUser.displayName

    return (
      <div className="sc-header">
        <img className="sc-header--img" src={imageUrl} alt="" />
        <div className="sc-header--team-name"> {name} </div>
        <div className="sc-header--close-button" onClick={this.props.onClose}>
          <img src={closeIcon} alt="" />
        </div>
      </div>
    )
  }
}

export default Header
