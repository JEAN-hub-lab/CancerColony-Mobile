import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // ใช้แบบพื้นฐานไปก่อน
import { getFirestore } from "firebase/firestore";

// ค่า Config เดิมของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyA01d61MQfs5xHIMq_pZe4CeElhp0edX5k",
  authDomain: "mylabapp-9501e.firebaseapp.com",
  projectId: "mylabapp-9501e",
  storageBucket: "mylabapp-9501e.firebasestorage.app",
  messagingSenderId: "139689635497",
  appId: "1:139689635497:web:0145c95fc27193fc6403b8",
  measurementId: "G-H9KS9E92S6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // แบบ simple (ถ้าปิดแอปอาจจะต้อง login ใหม่ แต่แอปไม่แดงแน่นอน)
const db = getFirestore(app);

export { auth, db };