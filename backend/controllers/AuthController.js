import jwt from 'jsonwebtoken';
const dbClient = require("../js/firebase");

class AuthController {

    static async verifyToken(req, res, next) {
        //use req.header as opposed to req.headers(IDK why!)
        //ok use any, still dk why!
        const header = req.headers.cookie;

        if( header && typeof header != null) {
        const token = header.split('=')[1];
        }
        if (typeof token == undefined){
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
            res.clearCookie('token');
            return res.redirect('/login');
            // migrate to API
            // return res.status(500).json({error: `Internal server error: ${err}`});
        }
    }
}

module.exports = AuthController;