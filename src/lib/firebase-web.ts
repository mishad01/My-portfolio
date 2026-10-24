const env = import.meta.env;

/**
 * Web config for Firebase project my-portfolio-fd9f0. It is public by design —
 * access is enforced by firestore.rules / storage.rules and App Check.
 * PUBLIC_FIREBASE_* env vars override it (e.g. for a staging project).
 */
export const FIREBASE_WEB = {
  apiKey: env.PUBLIC_FIREBASE_API_KEY || 'AIzaSyByqgfuqaAKpN2hLE3e2WLHALtA32H2Y1k',
  authDomain: env.PUBLIC_FIREBASE_AUTH_DOMAIN || 'my-portfolio-fd9f0.firebaseapp.com',
  projectId: env.PUBLIC_FIREBASE_PROJECT_ID || 'my-portfolio-fd9f0',
  storageBucket: env.PUBLIC_FIREBASE_STORAGE_BUCKET || 'my-portfolio-fd9f0.firebasestorage.app',
  appId: env.PUBLIC_FIREBASE_APP_ID || '1:671409225209:web:4b1372845f279973f9d128',
};
