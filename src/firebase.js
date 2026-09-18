import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCK2X58fsuKbFziX0ZaF0Ib6ei0IXH7KEI",
  authDomain: "mypalstutorbot.firebaseapp.com",
  databaseURL: "https://mypalstutorbot-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mypalstutorbot",
  storageBucket: "mypalstutorbot.firebasestorage.app",
  messagingSenderId: "23912922160",
  appId: "1:23912922160:web:5f618b721c3aa373d301f5",
  measurementId: "G-2MX074EHJB"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
