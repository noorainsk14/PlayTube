// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "playtubelogin-a6e0a.firebaseapp.com",
  projectId: "playtubelogin-a6e0a",
  storageBucket: "playtubelogin-a6e0a.firebasestorage.app",
  messagingSenderId: "146107611247",
  appId: "1:146107611247:web:939543206d22cae088b59a",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };
