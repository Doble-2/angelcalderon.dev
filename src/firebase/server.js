import { initializeApp, cert, getApps } from "firebase-admin/app";

const activeApps = getApps();
const serviceAccount = {
  type: "service_account",
  project_id: import.meta.env.FIREBASE_PROJECT_ID,
  private_key_id: import.meta.env.FIREBASE_PRIVATE_KEY_ID,
  // Vercel/GitHub env vars often store multiline keys with \n
  private_key: (import.meta.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
  client_email: import.meta.env.FIREBASE_CLIENT_EMAIL,
  client_id: import.meta.env.FIREBASE_CLIENT_ID,
  auth_uri: import.meta.env.FIREBASE_AUTH_URI,
  token_uri: import.meta.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: import.meta.env.FIREBASE_AUTH_CERT_URL,
  client_x509_cert_url: import.meta.env.FIREBASE_CLIENT_CERT_URL,
};

const hasServiceAccount =
  typeof serviceAccount.project_id === "string" &&
  serviceAccount.project_id.length > 0 &&
  typeof serviceAccount.client_email === "string" &&
  serviceAccount.client_email.length > 0 &&
  typeof serviceAccount.private_key === "string" &&
  serviceAccount.private_key.length > 0;

const initApp = () => {
  if (import.meta.env.PROD) {
    console.info('PROD env detected. Using default service account.')
    // Use default config in firebase functions. Should be already injected in the server by Firebase.
    return initializeApp()
  }

  if (hasServiceAccount) {
    console.info('Loading service account from env.')
    return initializeApp({
      credential: cert(serviceAccount)
    })
  }

  // Dev fallback: don't crash the whole app when credentials aren't configured.
  // Firestore reads are already wrapped in try/catch at call sites.
  console.warn('[firebase-admin] Missing FIREBASE_* env vars. Initializing without explicit credentials.')
  return initializeApp()
}

export const app = activeApps.length === 0 ? initApp() : activeApps[0];