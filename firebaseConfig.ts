import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
const firebaseConfig = {
  apiKey: "AIzaSyDinyxzaGHoRovZpYflhCbKAZLmavmfUlc",
  authDomain: process.env.fb_authDomain,
  projectId: process.env.fb_projectId,
  storageBucket: process.env.fb_storageBucket,
  messagingSenderId: process.env.fb_messagingSenderId,
  appId: process.env.fb_appId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
