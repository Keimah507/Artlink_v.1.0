import {app, db } from "./firebase.js";
import {doc, getFirestore, setDoc } from "firebase/firestore";



document.getElementById('contactForm').addEventListener('click',
("submit", submitForm));

function submitForm(e) {
    e.preventDefault();
        
    let username = getElementValById("username");
    let email = getElementValById("email");
    let bio = getElementValById("bio");

    console.log(`${username}, ${email}, ${bio}`);
}

const getElementValById = (id) => {
    return document.getElementById('id').value;
}

//await setDoc(doc(db, "Users"), {
//    username: username,
//    email: email,
//    Bio: bio
//});