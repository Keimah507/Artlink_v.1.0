const { uuidv4 } = require("@firebase/util");
const { query, collection, where, getDocs } = require("firebase/firestore");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const jwt = require("jsonwebtoken");
const dbClient = require("../js/firebase");
const auth = getAuth();

class AuthController {
    static secretkey = uuidv4;

    static async getConnect(res, req) {
        const { email, password } = req.body;

        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user
        })
        .catch((error) => {
            console.error(error);
        })

        // TODO: connect to Firestore and to check if data above exists in db

        // const userExistsQuery = query(collection(dbClient, 'users'), where('email', '==', email));
        // const queryExistsSnapshot = await getDocs(userExistsQuery);
        // if (queryExistsSnapshot.size < 0){
        //    alert("user not found");
        //    return;
        // }

    //     try {
    //         const passwordMatchQuery = query(collection(dbClient, 'users'), where('password', '==', password));
    //         const queryMatchSnapshot = await getDocs(passwordMatchQuery);
    //         if (queryMatchSnapshot.size < 0){
    //             alert("Passwords don't match");
    //             return;
    //         }
    //     } catch (err){
    //         return res.status(500).json({Error: "Internal server error" });
    //     }
    }
}

module.exports = AuthController;