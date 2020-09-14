import firebase from 'firebase';

const firebaseApp = firebase.initializeApp ({
    apiKey: "AIzaSyAFqy8uPTrr1KHjXDCeN_Qh6Pg51RJplp4",
    authDomain: "woodzgram.firebaseapp.com",
    databaseURL: "https://woodzgram.firebaseio.com",
    projectId: "woodzgram",
    storageBucket: "woodzgram.appspot.com",
    messagingSenderId: "209743702100",
    appId: "1:209743702100:web:6dbae392f29f960fc0a5c1"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };