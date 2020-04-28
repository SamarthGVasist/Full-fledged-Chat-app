import firebase from 'firebase'
var firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "test-16110.appspot.com",
    messagingSenderId: "1091965719681",
    appId: "",
    measurementId: "G-6VV9HPSPM4"
  };
  

  // Initialize Firebase
const fire=firebase.initializeApp(firebaseConfig);
export default firebase;
