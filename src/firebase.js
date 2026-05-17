import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCPHWRF6K7QcAeOMChLgu76Pn5XM5V5eu0",
  authDomain: "pawbook-977e1.firebaseapp.com",
  projectId: "pawbook-977e1",
  storageBucket: "pawbook-977e1.firebasestorage.app",
  messagingSenderId: "630788519268",
  appId: "1:630788519268:web:01daeb92d9c1121b257671",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);