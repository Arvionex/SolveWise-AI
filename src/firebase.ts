import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBwVFKeIyzLQNFgGKSJkFgmtKZVLgVATk4",
  authDomain: "solvewise-ai.firebaseapp.com",
  projectId: "solvewise-ai",
  storageBucket: "solvewise-ai.firebasestorage.app",
  messagingSenderId: "952207980928",
  appId: "1:952207980928:web:239089bfcacf5982256965",
  measurementId: "G-Z268CTPR0G"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
