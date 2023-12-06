// import * as firebase from "firebase/app";
// import "firebase/storage";
// import { getAnalytics } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "star-condomine.firebaseapp.com",
  projectId: "star-condomine",
  storageBucket: "star-condomine.appspot.com",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

// // Initialize Firebase
// export const fire = firebase.initializeApp(firebaseConfig);
// export const analytics = getAnalytics(fire);