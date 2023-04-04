import { getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import { query, collection, getDocs, setDoc, where, addDoc, doc } from "firebase/firestore";
import bcrypt, { compare } from "bcrypt";
import AuthController from "./AuthController.js";
import dbClient from "../js/firebase.js";
const jwt = require("jsonwebtoken");
const auth = getAuth();

require("dotenv").config();

export default class UsersController {

    static async postNew(req, res) {
         const { username, email, password, bio } = req.body;

         if (!username || !email || !password) {
            return res.status(401).json({error: "Missing required fields"})
         }
         // TODO: connect to Firestore and to check if data above exists in db

         // const userExistsQuery = query(collection(dbClient, 'users'), where('email', '==', email));
         // const queryExistsSnapshot = await getDocs(userExistsQuery);
         // if (queryExistsSnapshot.size > 0){
         //    res.status(400).json({error: "user already exists"});
         //    return;
         // }
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
      // res.redirect('/marketplace');

   } catch(err) {
      return res.status(500).json({error: err});
   }
   const token = jwt.sign(
      { email: user.email }, process.env.JWT_SECRET_KEY,
      {expiresIn: "2h"}
      );

      res.status(200).json({username: user.username ,email: user.email, jwt_token: token});
}


   //TODO: add getUser method(With auth)
   static async getUser(req, res) {
   const { email, password } = req.body;
   
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
      return res.status(403).json({error: "Password incorrect"});
   }

   // res.redirect('/profile');
   
   const token = jwt.sign(
    {email: email}, process.env.JWT_SECRET_KEY,
    { expiresIn: "2h"}
   );

   res.status(200).json({jwt_token: token});
 }
}

// module.exports = UsersController;