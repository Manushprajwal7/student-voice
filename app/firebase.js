import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCmy23J0VpiceqEUPx3_dLRgCay14BLMfc",
  authDomain: "studentvoice-11226.firebaseapp.com",
  projectId: "studentvoice-11226",
  storageBucket: "studentvoice-11226.appspot.com",
  messagingSenderId: "210590252305",
  appId: "1:210590252305:web:c075d2b8913843c8d3e0b0",
  measurementId: "G-SDBEK9R478",
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
