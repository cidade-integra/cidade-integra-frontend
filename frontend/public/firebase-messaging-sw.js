importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

const firebaseConfig = {
  apiKey: "AIzaSyCa6WkPGhGp59fi1vPQPpwkU3iLxk48duA",
  authDomain: "cidadeintegra.firebaseapp.com",
  projectId: "cidadeintegra",
  storageBucket: "cidadeintegra.firebasestorage.app",
  messagingSenderId: "677900581774",
  appId: "1:677900581774:web:55b7f22512b4a4e06682df",
  measurementId: "G-QZT88Y8C4F"
};

firebase.initializeApp(firebaseConfig)
const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Recivied background message', payload)

    const notificationTitle = payload.notification.title
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/Logo.png'
    }
    self.registration.showNotification(notificationTitle, notificationOptions)
})
