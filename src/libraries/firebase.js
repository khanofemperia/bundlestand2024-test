import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAoy62mRXH3QH0tMJRK5GbYkmV_g5R93To",
  authDomain: "sample-f415e.firebaseapp.com",
  projectId: "sample-f415e",
  storageBucket: "sample-f415e.appspot.com",
  messagingSenderId: "851979969054",
  appId: "1:851979969054:web:fea21eb3f7f091adb0040f",
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp(); // Ensure that Firebase is not initialized multiple times.
export const database = getFirestore(app);
