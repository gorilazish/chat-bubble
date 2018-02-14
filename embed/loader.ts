import Cookies from 'js-cookie'
import './loader.css'

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

const isDev = process.env.NODE_ENV === 'development'
const EVENT_PREFIX = 'BelloWidgetMessage-'
const FRAME_ID = 'bello-widget-frame'
const allowedOrigins = ['https://widget.belloforwork.com', 'https://bello-widget.firebaseapp.com']
const COOKIE_NAMESPACE = 'BelloWidgetState'

function handleToggleEvent() {
  const frame = document.getElementById(FRAME_ID)
  if (frame) {
    const openClassName = 'bello-widget-frame-open'
    const isOpen = frame.classList.contains(openClassName)
    if (isOpen) {
      frame.classList.remove(openClassName)
    } else {
      frame.classList.add(openClassName)
    }
  }
}

function handleRequestSettingsEvent() {
  return (window as any).BelloWidgetSettings
}

function handlePersistEvent({ key, value }): void {
  const state = Cookies.getJSON(COOKIE_NAMESPACE) || {}
  state[key] = value
  Cookies.set(COOKIE_NAMESPACE, state)
}

function handleStorageGet({ key }): string {
  const state = Cookies.getJSON(COOKIE_NAMESPACE) || {}
  return state[key]
}

function handleStorageClear() {
  Cookies.remove(COOKIE_NAMESPACE)
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
  if ((isDev || allowedOrigins.indexOf(origin) !== -1) && data.name) {
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

  const frameWrapper = document.createElement('div')
  frameWrapper.className = 'bello-widget-frame'

  const frame = document.createElement('iframe')
  frame.allowFullscreen = true
  frame.scrolling = 'no'
  frame.src =
    process.env.NODE_ENV === 'development'
      ? '//localhost:3000/index.html'
      : 'https://widget.belloforwork.com/index.html'

  frameWrapper.appendChild(frame)
  frameWrapper.id = FRAME_ID
  root.appendChild(frameWrapper)

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
