import poster from './poster'

// todo: add option to store locally or on parent
// todo: add fallback to cookies or use some storage lib
const persistance = {
  async setItem(key: string, value: any): Promise<void> {
    const stringified = JSON.stringify(value)
    return poster.sendMessage('storage-set', { key, value: stringified })
  },

  async getItem(key: string): Promise<any> {
    return poster.sendMessage('storage-get', { key }).then(val => {
      return val ? JSON.parse(val) : val
    })
  },

  async clear(): Promise<void> {
    return poster.sendMessage('storage-clear')
  },
}

export default persistance
