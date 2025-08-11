// Import Firebase and GoogleAuthProvider
import {initializeApp} from "firebase/app"
import {getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged} from "firebase/auth"
import {getAnalytics} from "firebase/analytics"
// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA0uuve611iz77KI6rsRaPV2tXdwbs9E0",
  authDomain: "jinn-education.firebaseapp.com",
  databaseURL: "https://jinn-education-default-rtdb.firebaseio.com",
  projectId: "jinn-education",
  storageBucket: "jinn-education.firebasestorage.app",
  messagingSenderId: "188314630412",
  appId: "1:188314630412:web:300af24973f6cb95af3129",
  measurementId: "G-Z6F90QVS1Z"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

// Initialize Firebase Authentication and Google Auth Provider
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider, signInWithPopup, onAuthStateChanged}
