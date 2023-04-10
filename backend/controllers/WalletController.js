import AuthController from "./AuthController";
// import { ethers } from "ethers";

class WalletController {
    static async connectWallet(req, res) {
        try {
          // Check if the user has MetaMask installed
          if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask to connect your wallet.');
            return;
          }
    
          // Request access to the user's MetaMask account
          await window.ethereum.request({ method: 'eth_requestAccounts' });
    
          // Redirect the user to the /connect-wallet route
        //   window.location.href = '/connect-wallet';
        } catch (error) {
          console.error(error);
          alert('An error occurred while connecting your wallet. Please try again later.');
        }
      }
}
const walletController = new WalletController();