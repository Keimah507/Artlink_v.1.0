class WalletController {
    async connectWallet() {
        if (typeof window.ethereum !== 'undefined') {
            const provider = new ethers.providers.Web3Provider(window.ethereum);

            try {
                await window.ethereum.request({method: 'eth_requestAccounts'});
                const signer = provider.getSigner();
                const walletAddress = await signer.getAddress();

                // const auth = getAuth();
                // const user = auth.currentUser;
                // if (user) {
                //     const usersRef = doc(getFirestore(), 'users', user.email);
                //     await setDoc(usersRef, {walletAddress}, { merge: True });
                // }
                fetch('/saveWalletAddress', {
                    method: 'POST',
                    headers: {
                        'Content-Type' : 'Application/json'
                    },
                    body: JSON.stringify({
                        walletAddress: walletAddress
                    })
                })
                .then((resp) => {
                    console.log("Wallet Address fetched succesfully");
                })
                .catch((err) => {
                    console.log(`Error fetching wallet Address: ${err}`);
                });
                console.log(`Wallet address: ${walletAddress}`);
            } catch(err) {
                console.log(err);
            }
        } else {
            window.location.href('https://metamask.io/download.html');
        }
    }
}