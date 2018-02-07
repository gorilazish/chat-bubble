import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { RootStore } from './stores'
import App from './App'
import { initFb } from './firebase/init'
import persistance from './lib/persistance'
import poster from './lib/poster'
import * as T from './types/types'

async function getSettings(): Promise<{ settings: T.IBelloWidgetSettings; state: T.IPersistedState }> {
  if (process.env.NODE_ENV === 'development') {
    const settings = (await persistance.getItem('BelloWidgetSettings')) as T.IBelloWidgetSettings
    const state = await persistance.getItem('BelloWidgetState')
    if (!settings) {
      throw new Error('Add mock BelloWidgetSettings to local storage when in dev mode')
    }
    return { settings, state }
  } else {
    const payloads = await Promise.all([
      poster.sendMessage('request-settings'),
      persistance.getItem('BelloWidgetState'),
    ])
    return { settings: payloads[0].settings, state: payloads[1] }
  }
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

getSettings()
  .then(({ settings, state }) => {
    initFb()
    render(document.getElementById('root')!, settings, state)
  })
  .catch(err => console.error(err))
