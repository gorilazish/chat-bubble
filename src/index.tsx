import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { RootStore } from './stores'
import App from './App'
import { initFb } from './firebase/init'
import * as T from './types'

function getSettings(): Promise<T.IBelloWidgetSettings> {
  return new Promise((res, rej) => {
    if (process.env.NODE_ENV === 'development') {
      const settings = localStorage.getItem('BelloWidgetSettings')
      if (settings) {
        res(JSON.parse(settings))
      } else {
        throw new Error('Add mock BelloWidgetSettings to local storage when in dev mode')
      }
    } else {
      let settings: T.IBelloWidgetSettings
      window.parent.postMessage({ name: 'request-settings' }, '*')
      window.addEventListener('message', function(event) {
        if (event.data.name === 'receive-settings') {
          settings = event.data.settings
        }
      })
      window.setTimeout(() => {
        settings ? res(settings) : rej(new Error('Cannot load widget settings from parent window'))
      }, 2000)
    }
  })
}

function render(element: HTMLElement, widgetSettings: T.IBelloWidgetSettings) {
  const rootStore = new RootStore(widgetSettings)

  const app = (
    <Provider {...rootStore}>
      <App/>
    </Provider>
  )

  ReactDOM.render(app, element)
}

getSettings().then(settings => {
  initFb()
  render(document.getElementById('root')!, settings)
})
