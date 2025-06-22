import { initializeApp } from "firebase/app";
import {getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCa6WkPGhGp59fi1vPQPpwkU3iLxk48duA",
  authDomain: "cidadeintegra.firebaseapp.com",
  projectId: "cidadeintegra",
  storageBucket: "cidadeintegra.firebasestorage.app",
  messagingSenderId: "677900581774",
  appId: "1:677900581774:web:55b7f22512b4a4e06682df",
  measurementId: "G-QZT88Y8C4F"
};

const app = initializeApp(firebaseConfig)
const messaging = getMessaging(app)

export { messaging, getToken, onMessage }