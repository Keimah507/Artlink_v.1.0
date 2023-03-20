// import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";
import express from "express";
import UsersController from "../controllers/UsersController.js";
import AppController from "../controllers/AppController.js";
import path from "path";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyD4u9g_glUgfsf4ASz1qKyXSq2FIiVCzy8",
//     authDomain: "nft-marketplace-e6568.firebaseapp.com",
//     projectId: "nft-marketplace-e6568",
//     storageBucket: "nft-marketplace-e6568.appspot.com",
//     messagingSenderId: "300016163915",
//     appId: "1:300016163915:web:de8b0c90e408a9e06f01ce",
//     measurementId: "G-M0GFXMYKDV"
//   };
  
//   // Initialize Firebase
//   const app = initializeApp(firebaseConfig);
//   const db = getFirestore(app);

const app = express();

const router = express.Router();
const __dirname = path.resolve();
  
router.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html');
});
  
router.get('/register', (req, res) => {
  res.sendFile(__dirname + '/src/register.html');
});

router.get('/login', (req, res) => {
  res.sendFile(__dirname + '/src/login.html');
});

router.get('/collection', (req, res) => {
  res.sendFile(__dirname + "/src/collection.html");
});

router.get('/getstatus', (req, res) => {
  AppController.getStatus(req, res);
});

router.post('/register', (req, res) => {
  UsersController.postNew(req, res);
});

module.exports = router;
