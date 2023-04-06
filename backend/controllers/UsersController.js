import { getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import { query, collection, getDocs, setDoc, where, addDoc, doc, getDoc } from "firebase/firestore";
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

         const userExistsQuery = query(collection(dbClient, 'users'), where('email', '==', email));
         const queryExistsSnapshot = await getDocs(userExistsQuery);
         if (queryExistsSnapshot.size > 0){
            res.status(400).json({error: "user already exists"});
            return;
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

      res.set('Authorization', `Bearer ${token}`);
      res.redirect('/marketplace');
}


   //TODO: add login method(With auth)
   static async login(req, res) {
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

   
   const token = jwt.sign(
    {email: email}, process.env.JWT_SECRET_KEY,
    { expiresIn: "2h"}
   );

   res.redirect('/profile');
   res.set('Authorization', `Bearer ${token}`)
 }

    //TODO: add getUser method(With auth)
    static async getUser(req, res) {
      const token = req.header('X-token');
      const userid = req.query.email;
      try {
         const usersCollection = collection(dbClient, 'users');
         const usersQuery = query(usersCollection, where("email", "==", userid));
         const querySnapshot = await getDocs(usersQuery);
         if (querySnapshot.size === 0){
            return res.status(400).json({error: "User not found"});
         }
         const userData = querySnapshot.docs[0].data();
         const { username, email:userEmail, Bio: bio} = userData;
         return res.status(200).json({username, userEmail, bio});
         // const docRef = await doc(dbClient, 'users', userid);
         // const usersDoc = await getDoc(docRef);
         // if(!usersDoc.exists()){
         //    return res.status(400).json({error: "User not found"});
         // }
         // const userData = usersDoc.data();
         // const {username, bio} = userData;

         // return res.status(200).json({Username: username, email: userid, Bio: bio});
      // res.render('/profile', {user: userData});

      } catch (err) {
         res.status(500).json({error: `Internal server Error: ${err}`});
      }


    }
}

// module.exports = UsersController;