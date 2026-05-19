import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The regex replaces the literal string "\n" with actual line breaks so the key is read correctly
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin Initialized Successfully');
  } catch (error) {
    console.error('Firebase Admin Initialization Error:', error.stack);
  }
}

let db = null;
try {
  if (admin.apps.length > 0) {
    db = admin.firestore();
  }
} catch (e) {
  console.warn("Failed to initialize firestore:", e.message);
}

export { db };