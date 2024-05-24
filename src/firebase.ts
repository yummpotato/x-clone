import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAs8k2yrShSOV1u0PmCO8fZXFHNrnJ9r-g",
  authDomain: "twitter-clone-1d74b.firebaseapp.com",
  projectId: "twitter-clone-1d74b",
  storageBucket: "twitter-clone-1d74b.appspot.com",
  messagingSenderId: "669534503914",
  appId: "1:669534503914:web:9acb1a76440295826ca893",
  measurementId: "G-MJ3HTCR9HM"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app); // app에 대한 인증을 사용하기 위한 코드