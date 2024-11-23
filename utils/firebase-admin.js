// utils/firebase-admin.js
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const firebaseAdminConfig = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
};

let firebaseApp;

export function initializeFirebaseAdmin() {
  if (!getApps().length) {
    try {
      firebaseApp = initializeApp({
        credential: cert(firebaseAdminConfig),
      });
      console.log("Firebase Admin initialized successfully");
    } catch (error) {
      console.error("Error initializing Firebase Admin:", error);
      throw error;
    }
  } else {
    firebaseApp = getApps()[0];
  }
  return firebaseApp;
}

export { getAuth };
