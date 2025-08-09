// Centralized firebase-admin initialization.
// During Vite/Angular HMR or SSR restarts the module can be evaluated multiple times.
// firebase-admin throws if initializeApp() is called more than once for the default app,
// so we guard using the existing apps list.
import * as admin from "firebase-admin";

if (admin.apps.length === 0) {
  admin.initializeApp();
}

export const db = admin.firestore();

