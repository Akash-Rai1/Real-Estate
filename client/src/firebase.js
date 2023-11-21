// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIBEBASE_API_KEY,
    authDomain: "mern-buddy.firebaseapp.com",
    projectId: "mern-buddy",
    storageBucket: "mern-buddy.appspot.com",
    messagingSenderId: "338397250654",
    appId: "1:338397250654:web:ce7d3f82411764fe4fe0cf",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
