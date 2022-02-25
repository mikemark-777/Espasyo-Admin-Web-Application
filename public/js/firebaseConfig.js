// Initialize Firebase Web App Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDeEGIsqoUZ4dayrWgk4Oe7FxchZsXzjg8",
    authDomain: "espasyo-8fef6.firebaseapp.com",
    projectId: "espasyo-8fef6",
    storageBucket: "espasyo-8fef6.appspot.com",
    messagingSenderId: "142003418706",
    appId: "1:142003418706:web:47fab77cb78398df40918b"
};
//initialize firebase
const espasyoWebApp = firebase.initializeApp(firebaseConfig);

const auth = espasyoWebApp.auth();
const database = espasyoWebApp.firestore();


//for creation, deleting, updating of email and password of admin account ONLY ===============================================
const secondApp = firebase.initializeApp(firebaseConfig, "secondApp");
const secondAppAuth = secondApp.auth();