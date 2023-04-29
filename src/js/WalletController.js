// import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
// import { getAuth } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
// import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";

// const firebaseConfig = {
//     apiKey: "AIzaSyD4u9g_glUgfsf4ASz1qKyXSq2FIiVCzy8",
//     authDomain: "nft-marketplace-e6568.firebaseapp.com",
//     projectId: "nft-marketplace-e6568",
//     storageBucket: "nft-marketplace-e6568.appspot.com",
//     messagingSenderId: "300016163915",
//     appId: "1:300016163915:web:de8b0c90e408a9e06f01ce",
//     measurementId: "G-M0GFXMYKDV"
// };
// const app = initializeApp(firebaseConfig);


class WalletController {
    async connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            try {
                await window.ethereum.request({method: 'eth_requestAccounts'});
                const signer = provider.getSigner();
                const walletAddress = await signer.getAddress();

                const auth = getAuth();
                if (updateCurrentUser(auth)) {
                    const usersRef = doc(getFirestore(), 'users', currentUser(auth).uid);
                    await setDoc(usersRef, {walletAddress}, { merge: True });
                }
                console.log(`Wallet address: ${walletAddress}`);
            } catch(err) {
                console.log(err);
            }
        } else {
            window.location.href('https://metamask.io/download.html');
        }
    }
}