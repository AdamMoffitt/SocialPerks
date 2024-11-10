import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCnSwaB4yf83JjdM6cHJVqWkj6iLVY3ado",
  authDomain: "socialperks-256f4.firebaseapp.com",
  projectId: "socialperks-256f4",
  storageBucket: "socialperks-256f4.firebasestorage.app",
  messagingSenderId: "409690059035",
  appId: "1:409690059035:web:90167ee8a749d200ff23be",
  measurementId: "G-LPF382DRPC",
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
