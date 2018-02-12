import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { useStrict } from 'mobx'
import { RootStore } from './stores'
import App from './App'
import { initFb } from './firebase/init'
import loadSegment from './analytics/loadSegment'
import persistance from './lib/persistance'
import poster from './lib/poster'
import * as T from './types/types'

async function getSettings(): Promise<{ settings: T.IBelloWidgetSettings; state?: T.IPersistedState }> {
  const [settings, state] = await Promise.all([
    poster.sendMessage('request-settings'),
    persistance.getItem('BelloWidgetState'),
  ])
  return { settings, state: state || undefined }
}

function render(element: HTMLElement, widgetSettings: T.IBelloWidgetSettings, state?: T.IPersistedState) {
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
  useStrict(true)
  render(document.getElementById('root')!, settings, state)
})
.catch(err => console.error(err))
