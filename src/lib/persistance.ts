import poster from './poster'

const isDev = process.env.NODE_ENV === 'development'

// todo: add option to store locally or on parent
// todo: add fallback to cookies or use some storage lib
const persistance = {
  async setItem(key: string, value: any): Promise<void> {
    const stringified = JSON.stringify(value)
    if (isDev) {
      localStorage.setItem(key, stringified)
    } else {
      return poster.sendMessage('storage-set', { key, value: stringified })
    }
  },

  async getItem(key: string): Promise<any> {
    if (isDev) {
      const val = localStorage.getItem(key)
      return val ? JSON.parse(val) : val
    } else {
      return poster.sendMessage('storage-get', { key }).then(val => {
        return val ? JSON.parse(val) : val
      })
    }
  },

  async clear(): Promise<void> {
    if (isDev) {
      return localStorage.clear()
    } else {
      return poster.sendMessage('storage-clear')
    }
  },
}

export default persistance
