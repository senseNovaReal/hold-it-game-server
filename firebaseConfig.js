import { initializeApp } from "firebase/app";
import dotenv from "dotenv";
dotenv.config();

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "hold-it-game.firebaseapp.com",
  projectId: "hold-it-game",
  storageBucket: "hold-it-game.firebasestorage.app",
  messagingSenderId: "74091192437",
  appId: "1:74091192437:web:2aefccb08fda1577f2583c",
  measurementId: "G-GFX1X32EHH"
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp
