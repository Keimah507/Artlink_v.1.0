import { query, collection, getDocs, setDoc, where, addDoc, doc, getDoc, writeBatch, updateDoc } from "firebase/firestore";
import bcrypt, { compare } from "bcrypt";
import AuthController from "./AuthController.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { base64 } from "@firebase/util";
const {v4:uuidv4} = require('uuid');
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { storage, dbClient } = require('../js/firebase.js');
// TODOS: use GCP storage (buckets) instead of firebase to add/render image files

require("dotenv").config();

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

         let profileImgUrl;
         const file = req.file;
         if(file){
            try {
            const imageRef = ref(storage, `profileImage/${email}`);
            // const imageBytes = Buffer.from(file.split(' ')[1], 'base64');
            const uploadTask = uploadBytes(imageRef, file.buffer);
            const snapshot = await uploadTask;
            // TODO: Make sure image url is saved to user Details
            getDownloadURL(snapshot.ref).then((async downloadUrl => {
               console.log(`File uploaded to ${downloadUrl}`);
               const details = doc(dbClient, 'users', email);
               await setDoc(details, downloadUrl);
            }));
            } catch(err) {
               console.error(err);
               return res.status(500).json({"Error": `Internal Server Error ${err}`});
            }
         }

         const saltRounds = 10
         const hashedPw = await bcrypt.hash(password, saltRounds);
         const user = {
            username: username,
            email: email,
            password: hashedPw,
            Bio: bio,
      };
      // TODO: Add data to firestore

      try {
      const docRef = await setDoc(doc(dbClient, 'users', email), user);   

   } catch(err) {
      return res.status(500).json({error: err});
   }
   const token = jwt.sign(
      { email: user.email }, process.env.JWT_SECRET_KEY,
      {expiresIn: "2h"}
      );
      //TODO: copy token and set it to headers(automatically)
      res.cookie('token', token, {
         httpOnly : true,
         });
      
      res.redirect('/marketplace');
}


   //TODO: add login method(With auth)
   static async login(req, res) {
   const { email, password } = req.body;
   res.clearCookie();
   
   // TODO: connect to Firestore and to check if data above exists in db

   const userExistsQuery = query(collection(dbClient, 'users'), where('email', '==', email));
   const queryExistsSnapshot = await getDocs(userExistsQuery);
   if (queryExistsSnapshot.size < 0){
      res.status(401).json({error: "user not found"});
      return;
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

   // console.log(token);
   // res.status(200).json({token: token});
   //A bit hardcoded...look for ways around this
   res.redirect(`/profile/:id?email=${email}`);
 }

    //TODO: add getUser method(With auth)
    static async getUser(req, res) {

      const userid = req.query.email;
      try {
         const usersCollection = collection(dbClient, 'users');
         const usersQuery = query(usersCollection, where("email", "==", userid));
         const querySnapshot = await getDocs(usersQuery);
         if (querySnapshot.size === 0){
            return res.status(400).json({error: "User not found"});
         }
         const userData = querySnapshot.docs[0].data();
         const { username, email:userEmail, Bio: bio, profileImg: profileImg} = userData;

         // res.status(200).json({username, userEmail, bio});
         res.render('profile', {username, userEmail, bio, profileImg});
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
      // console.log(userId);
      if(userId == null) {
         res.redirect('/login')
      }

      const file = req.file;
      if(file){
         try {
         const imageRef = ref(storage, `profileImages`);
         // const imageBytes = Buffer.from(file.split(' ')[1], 'base64');
         const uploadTask = uploadBytes(imageRef, file.buffer);
         const snapshot = await uploadTask;
         // TODO: Make sure image url is saved to user Details
         const profileImgUrl = await getDownloadURL(snapshot.ref).then(async (downloadUrl) => {
            console.log(`file uploaded at ${downloadUrl}`);
            const details = doc(dbClient, 'users', userId);
            await updateDoc(details, {
               profileImg: downloadUrl
            });
         });
         } catch(err) {
            console.error(err);
            return res.status(500).json({"Error": `Cannot upload file ${err}`});
         }
      }


      //update data
      try {
      const userDetails = doc(dbClient, 'users', userId);
      await updateDoc(userDetails, userData);
      res.redirect('/edit-profile');
      } catch(err) {
         res.status(500).json({Error: `Internal Server Error: Cannot update details ${err}`});
      }

    }
}

// module.exports = UsersController;