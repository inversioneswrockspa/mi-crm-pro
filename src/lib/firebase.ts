import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCz4ir4zP85-kZpU58xGQC3Tae5cDd_0QU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "proyectawrock.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "proyectawrock",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "proyectawrock.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "546882923266",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:546882923266:web:93fb5379338ee3687f301b",
  firestoreDatabaseId: "(default)"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: false,
}, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
