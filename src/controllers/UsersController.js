import { getAuth, createUserWithEmailAndPassword} from "firebase/auth";
import { collection, getDocs, setDoc, where } from "firebase/firestore";
import sha1 from "sha1";
import { dbClient } from "../js/firebase";
const auth = getAuth();

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
         //    alert("user already exists");
         //    return;
         // }
         const hashedPw = sha1(password)
         // TODO: switch to more secure hashing protocol
         const user = {
            username: username,
            email: email,
            password: hashedPw,
            Bio: bio,
      };
      // TODO: Add data to firestore
      try {
      const docRef = await addDoc(collection(dbClient, 'users'), user);
      console.log(`User registered with Id ${docRef.email}`);
      // createUserWithEmailAndPassword(auth, user.username, user.email, user.password, user.Bio)
      // .then((userCredential) => {
      //    const user = userCredential.user;
      // })
      //.catch((error){
      //  console.error(error);  
      // })
      res.redirect('/marketplace');

      // return res.status(200).json({user})
   } catch(err) {
      return res.status(500).json({error: err})
   }
}

   //TODO: add getUser method(With auth)
   static async getUser(req, res) {
   const { username, password } = req.body;
   
   // TODO: connect to Firestore and to check if data above exists in db

   // const userExistsQuery = query(collection(dbClient, 'users'), where('email', '==', email));
   // const queryExistsSnapshot = await getDocs(userExistsQuery);
   // if (queryExistsSnapshot.size < 0){
   //    alert("user not found");
   //    return;
   // }

   
 }
}

// module.exports = UsersController;