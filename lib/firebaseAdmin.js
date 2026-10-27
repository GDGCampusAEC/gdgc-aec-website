import admin from 'firebase-admin';

const hasCredentials = Boolean(
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY
);

if (!admin.apps.length) {
  if (hasCredentials) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
      console.log('Firebase Admin Initialized Successfully');
    } catch (error) {
      console.error('Firebase Admin Initialization Error:', error);
    }
  } else {
    console.warn('Firebase Admin credentials not set. Firebase Admin features will be disabled in preview/build mode.');
  }
}

/** @type {import("firebase-admin").firestore.Firestore | null} */
let db = null;
try {
  if (admin.apps.length > 0) {
    db = admin.firestore();
    try {
      db.settings({ ignoreUndefinedProperties: true });
    } catch {
      // settings() can only be called once per Firestore instance
    }
  }
} catch (e) {
  console.warn("Failed to initialize firestore:", e.message);
}

export { db };