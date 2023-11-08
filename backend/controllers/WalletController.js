import { Web3Provider } from "@ethersproject/providers";
import AuthController from "./AuthController.js";
import ethers from 'ethers';
import detectProvider from '@metamask/detect-provider';

export default class WalletController {
  // Move to client-side
    static async connectWallet(req, res) {
      
      const provider = await detectProvider();

      if(provider){
        const web3Provider = new Web3Provider(provider);
      try{
        const accounts = await web3Provider.listAccounts();

        if (accounts.length === 0){
          console.log('Wallet is not connected');
        } else {
          const walletAddress = accounts[0];
          console.log(`Your wallet address is ${walletAddress}`);
        }
      } catch(err){
        res.status(500).json({Error: `Internal Server Error: err`});
      }
    } else {
      window.location.href('https://metamask.io/download.html');
    }
  }
}
//       if (typeof window.ethereum === 'undefined') {
//         window.location.href('https://metamask.io/download.html');
//         }
//       else{
//         window.ethereum.request({ method: 'eth_accounts'})
//         .then(accounts => {
//           if (accounts.length === 0) {
//             console.log('Wallet is not connected');
//           }
//           else {
//             const walletAddress = accounts[0];
//             console.log(`Wallet address: ${walletAddress}`);
//           }
//         })
//         .catch(error => {
//           console.log(error);
//         });
//       }
//     }
// }
