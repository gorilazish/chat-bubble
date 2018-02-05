import fw from '@newsioaps/firebase-wrapper'

export const mockUser = {
  uid: 'aQaTeLE1SBfEDKCJJErW94gGJvD2',
}

export const mockParticipants: IParticipant[] = [
  {
    id: '88LARnXQ2nXCJJ3HqwgF1suHLpr1',
    type: 'user',
  },
]

export interface ICreatePostOptions {
  participants: IParticipant[]
  title: string
  id?: string
}

export interface ISendMessageOption {
  message?: string | null
  id?: string
  uid?: string | null
  tempUid?: string | null
  postId: string
}

export interface IParticipant {
  id: string
  type: 'group' | 'user' | 'tempUser'
}

export async function createNewConversation(postOpts, message) {
  const postId = await addPost(postOpts)
  await addComment(postId, message)
  return postId || null
}

export function addPost(postOpts) {
  const creatorId = mockUser.uid
  const postObject: ICreatePostOptions = {
    participants: postOpts.participants,
    title: postOpts.title,
  }
  try {
    return fw.posts.addPost(creatorId, postObject)
  } catch (e) {
    return console.error(e)
  }
}

export function addComment(postId, message) {
  const commentObject: ISendMessageOption = {
    uid: mockUser.uid,
    postId,
    message,
  }
  try {
    return fw.conversations.sendMessage(commentObject)
  } catch (e) {
    return console.error(e)
  }
}
