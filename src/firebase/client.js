import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "my-public-api-key",
  authDomain: "my-auth-domain",
  projectId: "my-project-id",
  storageBucket: "my-storage-bucket",
  messagingSenderId: "my-sender-id",
  appId: "my-app-id",
};

const app = initializeApp(firebaseConfig);
/*if (isSupported()) {
  // Inicializa Firebase Analytics
  const analytics = getAnalytics(app);
  // ...
}*/
export default app;
