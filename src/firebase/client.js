import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.API_KEY,
  authDomain: import.meta.env.AUTH_DOMAIN,
  projectId: import.meta.env.PROJECT_ID,
  storageBucket: import.meta.env.STORAGE_BUCKET,
  messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
  appId: import.meta.env.APP_ID,
  measurementId: import.meta.env.MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

isSupported().then((supported) => {
  if (supported) {
    // Inicializa Firebase Analytics
    const analytics = getAnalytics(app);
    // ...
  } else {
    console.log("Firebase Analytics no es compatible con este entorno.");
  }
}).catch((error) => {
  console.error("Error al verificar la compatibilidad de Firebase Analytics:", error);
});

export default app;