import firebase from "firebase"
require("@firebase/firestore")

var firebaseConfig = {
    apiKey: "AIzaSyDJsdAFKSX7Tr6lKeKpcK6vCOta9yFFHqA",
    authDomain: "book-santa-cffdb.firebaseapp.com",
    projectId: "book-santa-cffdb",
    storageBucket: "book-santa-cffdb.appspot.com",
    messagingSenderId: "332580148220",
    appId: "1:332580148220:web:4631f0eda8a0e881ab9879"
  };

  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()