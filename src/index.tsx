import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
// import { initFb } from './firebase/init'

function init(): HTMLElement {
  const div = document.createElement('div')
  div.id = 'bello-widget-root'
  document.body.appendChild(div)
  return div
}

function render(element: HTMLElement) {
  ReactDOM.render(
    <App />,
    element,
  )
}

// initFb()
const anchor = init()
render(anchor)
