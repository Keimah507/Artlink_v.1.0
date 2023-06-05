import { query, collection, getDocs, setDoc, where, addDoc, doc, getDoc, writeBatch, updateDoc } from "firebase/firestore";
import { getAuth, signInWithCustomToken, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import bcrypt from "bcryptjs";
import AuthController from "./AuthController.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { base64 } from "@firebase/util";
import {v4 as uuidv4} from 'uuid';
import admin from 'firebase-admin';
import jwt from "jsonwebtoken";
import axios from "axios";
import { Storage } from '@google-cloud/storage';
const storage = new Storage();
import { dbClient } from '../js/firebase.js';
import dotenv from 'dotenv';
// const serviceAccount =  require('../nft-marketplace-e6568-firebase-adminsdk-29b23-c07f2a02a5.json');

// admin.initializeApp({
//    credential: admin.credential.cert(serviceAccount),
// })
// TODOS: use GCP storage (buckets) instead of firebase to add/render image files

const bucketname = 'nft-marketplace-e6568.appspot.com';

const auth = getAuth();

dotenv.config();

export default class UsersController {

    static async postNew(req, res) {

         const { username, email, password, bio} = req.body;
         // console.log(username, email, password, bio);

         if (!username || !email || !password) {
            return res.status(401).json({error: "Missing required fields"})
         }
         // TODO: connect to Firestore and to check if data above exists in db

         const userExistsQuery = query(collection(dbClient, 'users'), where('email', '==', email));
         const queryExistsSnapshot = await getDocs(userExistsQuery);
         if (queryExistsSnapshot.size > 0){
            res.status(400).json({error: "user already exists"});
            return;
         }

         const file = req.file;
         if(file){
            try {
               const bucket = storage.bucket(bucketname);
               const blob = bucket.file(file.originalname);

               // Create a write stream to upload file to GCS
               const blobStream = blob.createWriteStream({
                  resumable: false,
                  metadata: {
                     contentType: file.mimetype
                  },
               });

               blobStream.on('error', (err) => {
                  res.json(500).json({Error: `Cannot upload file ${err}`});
               });

               blobStream.on('finish', async() => {
                  await blob.makePublic();

                  const profileImgUrl = `https://storage.googleapis.com/${bucketname}/${file.originalname}`;

                  const saltRounds = 10;
                  const hashedPw = await bcrypt.hash(password, saltRounds);
                  const user = {
                     username: username,
                     email: email,
                     password: hashedPw,
                     Bio: bio,
                     profileImg: profileImgUrl
                  };
                  
                  const userDetails = doc(dbClient, 'users', email);
                  await setDoc(userDetails, user);

                  console.log(`File uploaded to ${profileImgUrl}`);
               });

               blobStream.end(file.buffer);
            } catch(err) {
               console.error(err);
               return res.status(500).json({"Error": `Internal Server Error ${err}`});
            }
         }

   const token = jwt.sign(
      { email: email }, process.env.JWT_SECRET_KEY,
      {expiresIn: "2h"}
      );
   // TODO: copy token and set it to headers(automatically)
   res.cookie('token', token, {
      httpOnly : true,
   });
      
   createUserWithEmailAndPassword(auth, email, password)
   .then((userCredential) => {
      const user = userCredential.user;
   })
   .catch((err) => {
      const errorCode = err.code;
      const errorMessage = err.mesage;
      res.status(500).json({Error: `Internal Server Error ${errorMessage}`});
   })
   res.redirect('/marketplace');
}


   //TODO: add login method(With auth)
   //TODO: fix bug that requires user to log in twice to view profile
   static async login(req, res) {
   const { email, password } = req.body;
   res.clearCookie();
   
   // TODO: connect to Firestore and to check if data above exists in db

   const userExistsQuery = query(collection(dbClient, 'users'), where('email', '==', email));
   const queryExistsSnapshot = await getDocs(userExistsQuery);
   if (queryExistsSnapshot.empty){
      return res.status(401).json({error: "user not found"});
   }

   const userData = queryExistsSnapshot.docs[0].data();
   const isMatch = await bcrypt.compare(password, userData.password);

   if(!isMatch){
      return res.status(400).json({error: "Password incorrect"});
   }

   // assign JWT token to user
   const token = jwt.sign(
    {email: email}, process.env.JWT_SECRET_KEY,
    { expiresIn: "2h"}
   );

   res.cookie('token', token, {
   httpOnly : true,
   });

   signInWithEmailAndPassword(auth, email, password)
   .then((userCredential) => {
      const user = userCredential.user;
   })
   .catch((err) => {
      const ErrorCode = err.code;
      const errorMessage = err.mesage;
   });


   res.status(200).json({success: "Login successful"});
   // res.redirect('/marketplace');
 }

    //TODO: add getUser method(With auth)
    static async getUser(req, res) {


      const auth = getAuth();
      const user = auth.currentUser;
      if (user != null) {
      try {
         const usersCollection = collection(dbClient, 'users');
         // console.log(user.email);
         const usersQuery = query(usersCollection, where("email", "==", user.email));
         const querySnapshot = await getDocs(usersQuery);
         if (querySnapshot.size === 0){
            return res.status(400).json({error: "User not found"});
         }
         const userData = querySnapshot.docs[0].data();
         const { username, email:userEmail, Bio, profileImg: profileImg, walletAddress: walletAddress} = userData;

         res.render('profile', {username, userEmail, Bio, profileImg, walletAddress});
      } catch (err) {
         res.status(500).json({error: `Internal server Error: ${err}`});
      }
   } else {
      res.redirect('/login')
   }


    }

    static async getUsers(req, res) {
      try {
         const users = [];
         const querySnapshot = await getDocs(collection(dbClient, "users"));
         querySnapshot.forEach((doc) => {
            users.push(doc.data());
         });
         // res.status(200).json({users: docs})
         res.render('creators', {users: users});
      } catch (err) {
         res.status(500).json({error: `Internal server Error: ${err}`});
      }
    }

    static async updateUser(req, res) {

      const header = req.headers.cookie;

      if( !header || typeof header == undefined) {
          res.redirect('/login');
      }
      const token = header.split('=')[1];
      
      let userData = {};
      if(req.body.username) {
         userData.username = req.body.username;
      }

      if(req.body.email) {
         userData.email = req.body.email;
      }

      if(req.body.bio) {
         userData.Bio = req.body.bio;
      }

      const tokenId = jwt.decode(token, process.env.JWT_SECRET_KEY);
      const userId = tokenId.email;
      if(userId == null) {
         res.redirect('/login')
      }

      const file = req.file;
      if(file){
         try {
            const bucket = storage.bucket(bucketname);
            const blob = bucket.file(file.originalname);

            // Create a write stream to upload file GCS
            const blobStream = blob.createWriteStream({
               resumable: false,
               metadata: {
                  contentType : file.mimetype
               },
            });

            blobStream.on('error', (err) => {
               res.status(500).json({Error: `Cannot upload file ${err}`});
            });

            blobStream.on('finish', async() => {
               await blob.makePublic();

            const profileImgUrl = `https://storage.googleapis.com/${bucketname}/${file.originalname}`;

            const userDetails = doc(dbClient, 'users', userId);
            await updateDoc(userDetails, {
               profileImg: profileImgUrl
            });

            console.log(`File uploaded to ${profileImgUrl}`);
         });

         blobStream.end(file.buffer);
         } catch(err) {
            console.error(err);
            return res.status(500).json({"Error": `Cannot upload file ${err}`});
         }
      }


      //update data
      try {
      const userDetails = doc(dbClient, 'users', userId);
      await updateDoc(userDetails, userData);
      res.redirect('/users/me');
      } catch(err) {
         res.status(500).json({Error: `Internal Server Error: Cannot update details ${err}`});
      }

    }

    static logOut(req, res) {
      res.clearCookie('token');
      signOut(auth).then(() => {
         res.redirect('/login');
      })
      .catch((err) => {
         res.status(500).json({Error: `An error occured, ${err}`})
      })
    }
}
// module.exports = UsersController;