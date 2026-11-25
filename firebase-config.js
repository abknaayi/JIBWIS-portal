import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCgyNdIRy1dT2EgIp53fBWFSIIO-SLb5iA",
  authDomain: "jibwis-member-portal-8f159.firebaseapp.com",
  projectId: "jibwis-member-portal-8f159",
  storageBucket: "jibwis-member-portal-8f159.firebasestorage.app",
  messagingSenderId: "305121243578",
  appId: "1:305121243578:web:5eac598a84e5729c4a6d83",
  measurementId: "G-8DTHBPGY1B"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export default app;