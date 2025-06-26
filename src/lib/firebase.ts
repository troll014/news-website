import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA6EOnKFTOwMgayzpXtULph83Y2I8IvY_c",
  authDomain: "noticia-ca561.firebaseapp.com",
  projectId: "noticia-ca561",
  storageBucket: "noticia-ca561.firebasestorage.app",
  messagingSenderId: "1026672530383",
  appId: "1:1026672530383:web:4c58d245d3f0220fa3f8ba",
  measurementId: "G-2NETXN0GSX"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
