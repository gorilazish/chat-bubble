import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { initFb } from './firebase/init'

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement,
)

initFb()