import admin from 'firebase-admin';

console.log("PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
console.log("CLIENT_EMAIL:", process.env.FIREBASE_CLIENT_EMAIL);
console.log("PRIVATE_KEY:", process.env.FIREBASE_PRIVATE_KEY ? "EXISTS" : "MISSING");

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // ✅ SAFE
      }),
    });
    console.log('Firebase Admin Initialized Successfully');
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error);
  }
}

/** @type {import("firebase-admin").firestore.Firestore | null} */
let db = null;
try {
  if (admin.apps.length > 0) {
    db = admin.firestore();
  }
} catch (e) {
  console.warn("Failed to initialize firestore:", e.message);
}

export { db };