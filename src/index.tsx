import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { initFb } from './firebase/init'

function render(element: HTMLElement) {
  ReactDOM.render(
    <App />,
    element,
  )
}

initFb()
render(document.getElementById('root')!)
