import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_fb_apiKey,
  authDomain: process.env.NEXT_PUBLIC_fb_authDomain,
  projectId: process.env.NEXT_PUBLIC_fb_projectId,
  storageBucket: process.env.NEXT_PUBLIC_fb_storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_fb_messagingSenderId,
  appId: process.env.NEXT_PUBLIC_fb_appId,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
