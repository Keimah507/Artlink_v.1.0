import initializeFirestore from "../js/firebase.js";

export default class AppController {
    static getStatus(req, res) {
        const dbStatus = new initializeFirestore();
        if (dbStatus) {
        res.status(200).json({
            firestore: dbStatus,
        });
    }
    }
}