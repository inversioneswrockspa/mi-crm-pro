import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';

// Replace these placeholders with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCz4ir4zP85-kZpU58xGQC3Tae5cDd_0QU",
  authDomain: "proyectawrock.firebaseapp.com",
  projectId: "proyectawrock",
  storageBucket: "proyectawrock.firebasestorage.app",
  messagingSenderId: "546882923266",
  appId: "1:546882923266:web:93fb5379338ee3687f301b",
  firestoreDatabaseId: "(default)"
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: false,
}, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
