/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
interface ImportMetaEnv {
    readonly API_KEY: string;
    readonly AUTH_DOMAIN: string;
    readonly PROJECT_ID: string;
    readonly STORAGE_BUCKET: string;
    readonly MESSAGING_SENDER_ID: string;
    readonly APP_ID: string;
    readonly MEASUREMENT_ID: string;

  // Firebase Admin (server-side) credentials
  readonly FIREBASE_PROJECT_ID?: string;
  readonly FIREBASE_PRIVATE_KEY_ID?: string;
  readonly FIREBASE_PRIVATE_KEY?: string;
  readonly FIREBASE_CLIENT_EMAIL?: string;
  readonly FIREBASE_CLIENT_ID?: string;
  readonly FIREBASE_AUTH_URI?: string;
  readonly FIREBASE_TOKEN_URI?: string;
  readonly FIREBASE_AUTH_CERT_URL?: string;
  readonly FIREBASE_CLIENT_CERT_URL?: string;
  }




  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }