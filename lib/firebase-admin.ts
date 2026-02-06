import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://oece-tech-9aa8d-default-rtdb.firebaseio.com/',
  });
}

export const db = admin.database();
export const auth = admin.auth();
export const firestore = admin.firestore();
