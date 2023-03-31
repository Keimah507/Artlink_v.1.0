import { getFirestore } from "firebase/firestore";
import application from "../js/firebase.js";

export default class AppController {
    static getStatus(req, res) {
        const dbStatus = getFirestore(application);
        if (dbStatus) {
        res.status(200).json({
            firestore: dbStatus,
        });
    }
    }
}