import firebase from 'firebase'
var firebaseConfig = {
    apiKey: "AIzaSyCbPpQHN-udgX1AnBbXRENTDVEmgT5o4D0",
    authDomain: "test-16110.firebaseapp.com",
    databaseURL: "https://test-16110.firebaseio.com",
    projectId: "test-16110",
    storageBucket: "test-16110.appspot.com",
    messagingSenderId: "1091965719681",
    appId: "1:1091965719681:web:fd803272fdd9b0660d2980",
    measurementId: "G-6VV9HPSPM4"
  };
  

  // Initialize Firebase
const fire=firebase.initializeApp(firebaseConfig);
export default firebase;
