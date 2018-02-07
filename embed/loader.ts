interface IEventData {
  name: string
  payload: any
}

function documentReady(cb) {
  if (document.body) {
    cb()
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      cb()
    })
  }
}

const EVENT_PREFIX = 'BelloWidgetMessage-'
const FRAME_ID = 'bello-widget-frame'
const allowedOrigins = ['https://widget.belloforwork.com', 'https://bello-widget.firebaseapp.com']

function handleToggleEvent(payload) {
  const { width, height } = payload
  const frame = document.getElementById(FRAME_ID)
  if (frame) {
    frame.style.height = height
    frame.style.width = width
  }
}

function handleRequestSettingsEvent() {
  return (window as any).BelloWidgetSettings
}

function handlePersistEvent(payload) {
  if (window.localStorage) {
    localStorage.setItem(payload.key, payload.value)
  } else {
    // todo: use fallback
  }
}

function handleStorageGet(payload) {
  if (window.localStorage) {
    return localStorage.getItem(payload.key)
  } else {
    // todo: use fallback
  }
}

function handleStorageClear() {
  if (window.localStorage) {
    localStorage.clear()
  } else {
    // todo: use fallback
  }
}

function sendResponse(event: MessageEvent, handler) {
  const data: IEventData = event.data

  const response: any = {
    name: event.data.name,
    payload: undefined,
    error: false,
  }

  try {
    response.payload = handler(data.payload)
  } catch (err) {
    response.error = true
    response.payload = err.message
  } finally {
    return event.source.postMessage(response, event.origin)
  }
}

function postMessageHandler(event: MessageEvent) {
  const origin = event.origin
  const data: IEventData = event.data

  // make sure we're handling our events
  if (allowedOrigins.indexOf(origin) !== -1 && data.name) {
    const name = data.name.replace(EVENT_PREFIX, '')
    switch (name) {
      case 'toggle': {
        return sendResponse(event, handleToggleEvent)
      }
      case 'request-settings': {
        return sendResponse(event, handleRequestSettingsEvent)
      }
      case 'storage-set': {
        return sendResponse(event, handlePersistEvent)
      }
      case 'storage-get': {
        return sendResponse(event, handleStorageGet)
      }
      case 'storage-clear': {
        return sendResponse(event, handleStorageClear)
      }
      default: {
        return sendResponse(event, () => new Error('Event handler does not exist'))
      }
    }
  }
}

function createDomElements() {
  const root = document.createElement('div')
  root.id = 'bello-widget-root'
  root.style.position = 'absolute'
  root.style.zIndex = '2147483648'

  const frame = document.createElement('iframe')
  frame.id = FRAME_ID
  frame.src =
    process.env.NODE_ENV === 'development'
      ? '//localhost:3000/index.html'
      : 'https://widget.belloforwork.com/index.html'
  frame.style.border = 'none'
  frame.style.display = 'block'
  frame.style.position = 'fixed'
  frame.style.top = 'auto'
  frame.style.left = 'auto'
  frame.style.bottom = '24px'
  frame.style.right = '24px'
  frame.style.width = '76px'
  frame.style.height = '76px'
  frame.style.visibility = 'visibile'
  frame.style.zIndex = '2147483647'
  frame.style.maxHeight = '100vh'
  frame.style.maxWidth = '100vw'
  frame.style.transition = 'none'
  frame.style.background = 'none transaprent'
  frame.style.opacity = '1'

  root.appendChild(frame)

  documentReady(() => {
    document.body.appendChild(root)
  })
}

function attachPostMessageHandlers() {
  if (window.addEventListener) {
    window.addEventListener('message', postMessageHandler, false)
  } else {
    // @ts-ignore
    window.attachEvent('onmessage', postMessageHandler)
  }
}

const settings = (window as any).BelloWidgetSettings

if (settings) {
  const settings = (window as any).BelloWidgetSettings

  if (!settings.userId) {
    console.warn('BelloWidgetSettings is missing userId parameter')
  }

  createDomElements()
  attachPostMessageHandlers()
} else {
  console.warn('Cannot find Bello Widget configuration')
}
