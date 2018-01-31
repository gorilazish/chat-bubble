import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { initFb } from './firebase/init'

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement,
)
initFb()
registerServiceWorker()
