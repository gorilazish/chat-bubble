interface IResponseMessage {
  name: string
  payload: any
  error: boolean
}

interface IPostMessage {
  name: string
  payload: any
}

const prefix = 'BelloWidgetMessage-'

const poster = {
  sendMessage(name, payload?: any): Promise<any> {
    const timeout = 1000

    const message: IPostMessage = {
      // todo: add scope
      name: prefix + name,
      payload,
    }

    window.parent.postMessage(message, '*')

    return new Promise((res, rej) => {
      const timer = window.setInterval(() => {
        rej(new Error('No response from parent window. Timed out'))
      }, timeout)

      window.addEventListener('message', handleResponse, false)

      function handleResponse(ev: MessageEvent) {
        const data: IResponseMessage = ev.data
        // we only need to handle this same event
        if (data.name === prefix + name) {
          window.removeEventListener('message', handleResponse)
          window.clearInterval(timer)
          ev.data.error ? rej(new Error(ev.data.payload)) : res(ev.data.payload)
        }
      }
    })
  },
}

export default poster
