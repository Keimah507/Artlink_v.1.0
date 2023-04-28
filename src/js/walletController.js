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