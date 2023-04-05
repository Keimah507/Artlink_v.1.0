const admin = require("firebase-admin");
const { getAuth } = require("firebase/auth");
const { query, collection, where, getDocs } = require("firebase/firestore");
const { jwt } = require("jsonwebtoken");
const { v4:uuidv4 } = require("uuid");
const dbClient = require("../js/firebase");
const ServiceAccount = require('/home/devnick/Downloads/nft-marketplace-e6568-firebase-adminsdk-29b23-c07f2a02a5.json');
const auth = getAuth();

admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount)
});


class AuthController {

    static async verifyToken(res, req, next) {
            const authHeader = req.headers.Authorization;
            if (!authHeader) {
                res.set('WWW-Authenticate', 'Basic realm="User Visible Realm", charset="UTF-8"');
                res.status(401).json({Error: "Unauthorized"});
                return;
            }
            const token = authHeader.split(' ')[1];
            if (!token) {
                res.redirect('/login');
                // res.status(401).json({error: "Unauthorized"});
            }

            try {
                const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
                req.user = decodedToken;
                next();
            } catch(err) {
                return res.redirect('/404');
                // return res.status(500).json({error: "Internal server error"});
            }
    }
}

module.exports = AuthController;