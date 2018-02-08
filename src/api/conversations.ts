import * as T from '../types/types'

export function createWidgetConversation(body: T.ICreateConversationBody) {
    return fetch("https://us-central1-bello-staging.cloudfunctions.net/createWidgetConversation", {
        method: "post",
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