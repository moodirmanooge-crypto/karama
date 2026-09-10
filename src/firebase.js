import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Isku project-ka Firebase ee la wadaago apps-ka kale (Rising Star School, iwm).
// Collections-ka Karaamo waxay leeyihiin prefix "karama" si aanay ula tartamin xogta apps-ka kale.
const firebaseConfig = {
  apiKey: "AIzaSyBXFegVGIyVk02zY6Ks3DhcoWjomNw_ht0",
  authDomain: "one-click-onilne.firebaseapp.com",
  projectId: "one-click-onilne",
  storageBucket: "one-click-onilne.firebasestorage.app",
  messagingSenderId: "988928725446",
  appId: "1:988928725446:web:56205fbf19977e1643a2c7",
  measurementId: "G-B8N7WG87T2",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);

// Magacyada collections-ka (halkan kaliya waa halka la beddelayo haddii loo baahdo)
export const COLLECTIONS = {
  ADMIN: "karamaAdmin",
  LANDS: "karamaLands",
  LAND_REQUESTS: "karamaLandRequests",
  REGISTRATIONS: "karamaRegistrations",
  CONTACT_MESSAGES: "karamaContactMessages",
};

export default app;
