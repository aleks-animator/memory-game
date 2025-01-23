import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAW0Y1EanfZKXlwYPTeQbGcoBm-96Dphns",
  authDomain: "match-game-ae5bc.firebaseapp.com",
  projectId: "match-game-ae5bc",
  storageBucket: "match-game-ae5bc.appspot.com",
  messagingSenderId: "476956008321",
  appId: "1:476956008321:web:595e010aa190c7ff78d280"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;