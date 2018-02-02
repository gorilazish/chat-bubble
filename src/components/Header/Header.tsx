import React, { Component } from 'react'
const closeIcon = require('../../assets/close-icon.png')

import './Header.css'


interface IProps {
  imageUrl: string
  teamName: string
  onClose: () => void
}

class Header extends Component<IProps> {

  public render() {
    return (
      <div className='sc-header'>
        <img className='sc-header--img' src={this.props.imageUrl} alt='' />
        <div className='sc-header--team-name'> {this.props.teamName} </div>
        <div className='sc-header--close-button' onClick={this.props.onClose}>
          <img src={closeIcon} alt='' />
        </div>
      </div>
    )
  }
}

export default Header
