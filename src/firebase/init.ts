import fw from '@newsioaps/firebase-wrapper'
import firebase from 'firebase'

const configs = {
  staging: {
    apiKey: 'AIzaSyD8wt8BjLe_vh8s8QG2khZt0BZmFbO-by8',
    authDomain: 'bello-staging.firebaseapp.com',
    databaseURL: 'https://bello-staging.firebaseio.com',
    projectId: 'bello-staging',
    storageBucket: 'bello-staging.appspot.com',
    messagingSenderId: '327698290955',
  },
  production: {
    apiKey: 'AIzaSyA4NVmWNK6AhXzqi38i0GxpcH7nBRMxmu0',
    authDomain: 'bello-31de8.firebaseapp.com',
    databaseURL: 'https://bello-31de8.firebaseio.com',
    projectId: 'bello-31de8',
    storageBucket: 'bello-31de8.appspot.com',
    messagingSenderId: '13051232692',
  }
}

export function initFb() {
  const firebaseEnv = process.env.FIREBASE_ENV!
  const config = configs[firebaseEnv]
  if (!config) {
    throw new Error(`Firebase config not found for FIREBASE_ENV ${firebaseEnv}`)
  }
  firebase.initializeApp(config)
  fw.initFirebase(firebase.database(), firebase.auth(), null)
}
