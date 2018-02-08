import { User } from '../models'


export default {
    analyticsIdentify,
    analyticsStartConvo,
    analyticsSendMessage,
}

/**
 * EVENTS
 */

// todo: get auth user from fw instead?
// todo: add email when available
function analyticsIdentify(user: User) {
    const trackerOptions = {
        name: user.displayName || '',
        avatar: user.getSmallPhoto(),
    }

    identify(user.id, trackerOptions)
}

function analyticsStartConvo(conversationId, firstCommentId) {
    const trackerOptions = {
        conversationId,
        commentId: firstCommentId,
        totalRecipients: 1, // I guess there will be only one recipient in widget case
        individualRecipients: 1,
        inviteeRecipients: 0,
    }

    track('Start Conversation', trackerOptions)
}

function analyticsSendMessage(conversationId, commentId) {
    track('Send Message', { conversationId, commentId })
}

/**
 * Segment functions
 */

const context = {
    app: {
        name: 'Bello Widget',
        version: process.env.VERSION,
    }
}

function getClient() {
    return (window as any).analytics
}

function identify(uid, traits) {
    const client = getClient()
    if (uid) {
        client.identify({
            context,
            userId: uid,
            traits
        })
    }
}

function track(event, opts) {
    const client = getClient()
    client.track(event, opts)
}