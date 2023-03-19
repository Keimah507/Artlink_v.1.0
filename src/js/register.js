import { db } from "./firebase.js";
import { addDoc, collection } from "firebase/firestore";



const form = document.getElementById("contactForm");
form.addEventListener("submit", submitForm);
async function submitForm(event) {
    event.preventDefault();
        
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let bio = document.getElementById("bio").value;

    console.log(username, email, bio);

    await addDoc(collection(db, "Users"), {
        username: username,
        email: email,
        Bio: bio
    });
}

export default submitForm;