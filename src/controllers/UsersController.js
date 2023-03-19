import sha1 from "sha1";

export default class UsersController {

    static postNew(req, res) {
      try {
         const { username, email, password, bio } = req.body;

         if (!username || !email || !password) {
            return res.status(401).json({error: "Missing required fields"})
         }
         // TODO: connect to Firestore and to check if data above exists in db

         const hashedPw = sha1(password)
         // TODO: switch to more secure hashing protocol
         const user = {
            username: username,
            email: email,
            password: hashedPw,
            Bio: bio,
      };
      return res.status(200).json({user})
     // TODO: Add data to firestore
   } catch(err) {
      return res.status(500).json({error: "internal server error"})
   }
}

 //TODO: add getUser method(With auth)
}

// module.exports = UsersController;