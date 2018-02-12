import * as T from '../types/types'

// todo: inject based on env
const remoteUrl = 'https://us-central1-bello-staging.cloudfunctions.net'

/**
 * Fetch wrapper to make POST requests to our firebase functions HTTP endpoints
 */
async function postHttp(endpoint: string, body: any): Promise<any> {
  const response = await fetch(remoteUrl + endpoint, {
    method: 'POST', // should always be a POST
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const contentType = response.headers.get('content-type')

  if (contentType && contentType.includes('application/json')) {
    const json = await response.json()
    return json
  } else {
    // support only json payload for now
    return null
  }
}

/**
 * Resolves with postId
 */
export async function createWidgetConversation(body: T.ICreateConversationBody): Promise<string> {
  const path = '/createWidgetConversation'
  const res = await postHttp(path, body)
  return res.postId
}

export async function sendPostbackEvent(body: T.IPostbackEvent): Promise<void> {
  const path = '/widgetPostbackHook'
  await postHttp(path, body)
}
