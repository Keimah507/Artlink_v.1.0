const admin = require("firebase-admin");
import jwt from 'jsonwebtoken';
const dbClient = require("../js/firebase");
const ServiceAccount = require('/home/devnick/Downloads/nft-marketplace-e6568-firebase-adminsdk-29b23-c07f2a02a5.json');

admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount)
});


class AuthController {

    static async verifyToken(req, res, next) {
        //use req.header as opposed to req.headers(IDK why!)
        //ok use both
        const authHeader = req.headers['authorization'];

        if (authHeader && authHeader == null){
          res.status(401).json({error: "No Authorization Header"});
        }
        const token = authHeader.split(' ')[1];
        // Have to catch undefined error
        if (!token || token == null){
            res.status(401).json({error: "Not Authorized"});
        }
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
            if (!decodedToken) {
                req.status(401).json({error: "Not Authorized"});
            }
            req.user = decodedToken;
            next();
        } catch(err) {
            // return res.redirect('/404');
            return res.status(500).json({error: `Internal server error: ${err}`});
        }
    }
}

module.exports = AuthController;