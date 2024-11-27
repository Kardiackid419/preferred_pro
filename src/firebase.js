import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAAsae7hTeyyWg8jKheIG3aU-lRX7AYQAM",
  authDomain: "vast-dock-442020-q4.firebaseapp.com",
  projectId: "vast-dock-442020-q4",
  storageBucket: "vast-dock-442020-q4.firebasestorage.app",
  messagingSenderId: "415404074047",
  appId: "1:415404074047:web:74033f864c39c70f41448a",
  measurementId: "G-8W2T86SRM0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);