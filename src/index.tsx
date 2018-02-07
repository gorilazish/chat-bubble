import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { RootStore } from './stores'
import App from './App'
import { initFb } from './firebase/init'
import loadSegment from './analytics/loadSegment'
import * as T from './types'

function getSettings(): Promise<{ settings: T.IBelloWidgetSettings; state: T.IPersistedState }> {
  return new Promise((res, rej) => {
    if (process.env.NODE_ENV === 'development') {
      const settings = localStorage.getItem('BelloWidgetSettings')
      const state = localStorage.getItem('BelloWidgetState')

      const parsedSettings = settings ? JSON.parse(settings) : null
      const parsedState = state ? JSON.parse(state) : null

      if (!parsedSettings) {
        throw new Error('Add mock BelloWidgetSettings to local storage when in dev mode')
      }

      res({ settings: parsedSettings, state: parsedState })
    } else {
      let settings: T.IBelloWidgetSettings
      let state: T.IPersistedState

      window.parent.postMessage({ name: 'request-settings' }, '*')
      window.addEventListener('message', function(event) {
        if (event.data.name === 'receive-settings') {
          settings = event.data.settings
          state = event.data.state
        }
      })

      window.setTimeout(() => {
        settings ? res({ settings, state }) : rej(new Error('Cannot load widget settings from parent window'))
      }, 2000)
    }
  })
}

function render(element: HTMLElement, widgetSettings: T.IBelloWidgetSettings, state: T.IPersistedState) {
  const rootStore = new RootStore(widgetSettings, state)

  const app = (
    <Provider {...rootStore}>
      <App />
    </Provider>
  )

  ReactDOM.render(app, element)
}

getSettings().then(({ settings, state }) => {
  initFb()
  loadSegment()
  render(document.getElementById('root')!, settings, state)
})
