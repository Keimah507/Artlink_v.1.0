import express from "express";
import UsersController from "../controllers/UsersController.js";
// import AppController from "../controllers/AppController.js";
import AuthController from "../controllers/AuthController.js";
import WalletController from "../controllers/WalletController.js"
import NFTController from "../controllers/NFTController.js";
import jwt from 'jsonwebtoken';
import path from "path";
import { getAuth } from "firebase/auth";
import { dbClient } from "../js/firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { get } from "http";
import { async } from "@firebase/util";
const axios = require("axios");
const app = express();
const multer = require('multer');
const upload = multer({ 
   storage: multer.memoryStorage(),
   limits: { fileSize: 1024 * 1024 * 5}, // Max-size 5MB
});

const router = express.Router();
export default router;
const __dirname = path.resolve();

  
router.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index-3.html');
});
  
router.get('/register', (req, res) => {
  res.sendFile(__dirname + '/src/register.html');
});

router.get('/login', (req, res) => {
  res.sendFile(__dirname + '/src/login.html');
});

router.get('/logout', (req, res) => {
  UsersController.logOut(req, res);
});

router.get('/marketplace', AuthController.verifyToken, (req, res) => {
  res.sendFile(__dirname + '/src/index-2.html');
});

router.get('/activity', AuthController.verifyToken, (req, res) => {
  res.sendFile(__dirname + '/src/activity.html');
});

router.get('/item-details', AuthController.verifyToken, (req, res) => {
  res.sendFile(__dirname + '/src/item-details.html');
});

router.get('/post-details', AuthController.verifyToken, (req, res) => {
  res.sendFile(__dirname + '/src/post-details.html');
});

router.get('/newsletter', AuthController.verifyToken, (req, res) => {
  res.sendFile(__dirname + '/src/newsletter.html');
});

router.get('/creatore', AuthController.verifyToken, (req, res) => {
  res.sendFile(__dirname + '/src/creatore.html');
});

router.get('/privacy', (req, res) => {
  res.sendFile(__dirname + '/src/privacy.html');
});

router.get('/wallet', AuthController.verifyToken, (req, res) => {
  res.sendFile(__dirname + '/src/wallet.html');
});

router.get('/connect-wallet', AuthController.verifyToken, (req, res) => {
  WalletController.connectWallet(req, res);
});

router.get('/mintNFT', AuthController.verifyToken, (req, res) => {
  res.sendFile(__dirname + '/src/mintNFT.html')
});

router.get('/faq', (req, res) => {
  res.sendFile(__dirname + '/src/faq.html');
});

router.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/src/chat.html');
});

router.get('/artical', (req, res) => {
  res.sendFile(__dirname + '/src/artical.html');
});

router.get('/ranking', AuthController.verifyToken, (req, res) => {
  res.sendFile(__dirname + '/src/ranking.html');
});

router.get('/404', (req, res) => {
  res.sendFile(__dirname + '/src/404.html');
});
// work on this route
router.get('/profile', (req, res) => {
  res.sendFile(__dirname + '/src/profile.html');
});

router.get('/edit-profile', (req, res) => {
  res.sendFile(__dirname + '/src/edit-profile.html');
});

router.get('/blog', AuthController.verifyToken, (req, res) => {
  res.sendFile(__dirname + '/src/blog.html');
});

router.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/src/contact.html');
});

router.get('/submit-request', AuthController.verifyToken, (req, res) => {
  res.sendFile(__dirname + '/src/submit-request.html');
});

router.get('/collection', AuthController.verifyToken, (req, res) => {
  // NFTController.getNFT(req, res);
  res.sendFile(__dirname + "/src/collection.html");
});

// router.get('/getstatus', (req, res) => {
//   AppController.getStatus(req, res);
// });

router.post('/register', upload.single('profileImg'), (req, res) => {
  UsersController.postNew(req, res);
});

router.post('/login', (req, res) => {
  UsersController.login(req, res);
});

router.post('/edit-profile', upload.single('profileImg'), (req, res) => {
  UsersController.updateUser(req, res);
});

router.post('/mintNFT', upload.single('NFTImage'), async(req, res) => {
  try{
    const { nftName, NFTdescription, NFTCollection, nftPrice } = req.body;

    const header = req.headers.cookie;
    if(!header || typeof header == undefined) console.error('Cant fetch');
    const token = header.split('=')[1];
  
    const tokenId = jwt.decode(token, process.env.JWT_SECRET_KEY);
    const userId = tokenId.email;

    const userDocRef = doc(dbClient, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);
    if(userDocSnap.exists){
      const userData = userDocSnap.data();
      const walletAddress = userData.walletAddress;
      console.log(walletAddress);
      if(!walletAddress){
        window.location.href('/connect-wallet');
      }

      const file = req.file.toString();
      console.log(file);
      const imageBuffer = req.file.buffer;

      const ipfsUrl = await NFTController.uploadImageToIPFS(file);

      const txHash = await NFTController.createNFT(nftName, NFTdescription, nftImageIpfsHash, nftPrice, walletAddress);
      // console.log('Nft minted successfully')
    }
    res.status(200).json({Success: "NFT minted successfuly"});
  } catch(err) {
    console.error(err);
    res.status(500).json({Error: "Failed to mint NFT"});
  }
});

router.get('/getNFTS', (req, res) => {
  NFTController.getNFT(req, res);
})
router.get('/connect', (req, res) => {
  AuthController.verifyToken(req, res);
});

router.get('/users', async(req, res) => {
  UsersController.getUsers(req, res);
});

router.get('/creators', async(req, res) => {
  UsersController.getUsers(req, res)
});

router.post('/saveWalletAddress', async(req, res) => {
  const payload  = req.body;
  const walletAddress = payload.walletAddress;
  // console.log(walletAddress);


  const header = req.headers.cookie;
  if(!header || typeof header == undefined) console.error('Cant fetch');
  const token = header.split('=')[1];

  const tokenId = jwt.decode(token, process.env.JWT_SECRET_KEY);
  const userId = tokenId.email;
  try {
    const userDetails = doc(dbClient, 'users', userId);
    await updateDoc(userDetails, {
      walletAddress: walletAddress,
    });
  console.log('Saved to firestore');
  }catch(err){
  res.status(500).json({Error: `Internal Server Error: ${err}`})
  }
});

router.get('/users/me', AuthController.verifyToken, async(req, res) => {
UsersController.getUser(req, res);
});

// router.get('/users/me', AuthController.verifyToken, (req, res) => { 
//   res.redirect('/profile')
// })


// module.exports = router;
