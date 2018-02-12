import * as T from '../types/types'

// todo: move this to another file
function fetchWrapper(url, method, body) {
    return fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify(body),
    })
    .then(response => response.json())
    .then(data => data.postId)
    .catch(err => {
        console.error(err)
        return err
    })
}

export function createWidgetConversation(body: T.ICreateConversationBody) {
    return fetchWrapper("https://us-central1-bello-staging.cloudfunctions.net/createWidgetConversation", "POST", body)
}

export function sendMessageEventPayload(body: T.IMessageEventPayload) {
    return fetchWrapper("https://us-central1-bello-staging.cloudfunctions.net/messageEvent", "POST", body)
}