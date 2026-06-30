import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAe32ckj9YO1NX3xB22Tcia_n6-mTuT8fM",
  authDomain: "windtiers.firebaseapp.com",
  projectId: "windtiers",
  storageBucket: "windtiers.firebasestorage.app",
  messagingSenderId: "858991527139",
  appId: "1:858991527139:web:755dcba9f742446e4b71d6",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);