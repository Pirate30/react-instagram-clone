// const firebaseConfig = {

// };

import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyBziDO9PDetvY9yCwPXT48-DG9NU9vQ-Ek",
    authDomain: "react-instagram-clone-ba8f1.firebaseapp.com",
    projectId: "react-instagram-clone-ba8f1",
    storageBucket: "react-instagram-clone-ba8f1.appspot.com",
    messagingSenderId: "478090287525",
    appId: "1:478090287525:web:807eeb1f52400be8c2f04c"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };