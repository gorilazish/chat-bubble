import poster from './poster'

type Options = {
  remote?: boolean
}

// todo: add option to store locally or on parent
// todo: add fallback to cookies or use some storage lib
const persistance = {
  async setItem(key: string, value: string, options: Options = {}): Promise<void> {
    if (options.remote) {
      return poster.sendMessage('storage-set', { key, value })
    } else {
      return localStorage.setItem(key, value)
    }
  },

  async getItem(key: string, options: Options = {}): Promise<string|undefined> {
    if (options.remote) {
      let value = await poster.sendMessage('storage-get', { key })
      return value
    } else {
      return localStorage.getItem(key) || undefined
    }
  },

  async clear(options: Options = {}): Promise<void> {
    if (options.remote) {
      return poster.sendMessage('storage-clear')
    } else {
      localStorage.clear()
    }
  },
}

export default persistance
