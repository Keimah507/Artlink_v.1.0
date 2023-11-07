const express = require("express");
const UsersController = require("../controllers/UsersController.js");
const AuthController  = require("../controllers/AuthController.js");
const WalletController = require("../controllers/WalletController.js")
const NFTController = require("../controllers/NFTController.js");
const jwt = require('jsonwebtoken');
const path = require("path");
const {getAuth, onAuthStateChanged} = require("firebase/auth");
const { dbClient } = require("../js/firebase.js");
const { doc, getDoc, updateDoc } = require("firebase/firestore");
const app = express();
const multer = require('multer');
const FileController = require("../controllers/FileController.js");
const fs = require('fs');
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

// router.get('/addfile', (req, res) => {
//   res.sendFile(__dirname + '/src/addfile.html');
// })
  
router.get('/register', (req, res) => {
  res.sendFile(__dirname + '/src/register.html');
});

router.get('/login', (req, res) => {
  res.sendFile(__dirname + '/src/login.html');
});

router.get('/logout', (req, res) => {
  UsersController.logOut(req, res);
});

router.get('/marketplace', (req, res) => {
  res.sendFile(__dirname + '/src/index-2.html');
});

router.get('/activity', (req, res) => {
  res.sendFile(__dirname + '/src/activity.html');
});

router.get('/item-details', (req, res) => {
  res.sendFile(__dirname + '/src/item-details.html');
});

router.get('/post-details', (req, res) => {
  res.sendFile(__dirname + '/src/post-details.html');
});

router.get('/newsletter', (req, res) => {
  res.sendFile(__dirname + '/src/newsletter.html');
});

router.get('/creatore', (req, res) => {
  res.sendFile(__dirname + '/src/creatore.html');
});

router.get('/privacy', (req, res) => {
  res.sendFile(__dirname + '/src/privacy.html');
});

router.get('/wallet', (req, res) => {
  res.sendFile(__dirname + '/src/wallet.html');
});

router.get('/connect-wallet', (req, res) => {
  WalletController.connectWallet(req, res);
});

router.get('/mintNFT', (req, res) => {
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

router.get('/ranking', (req, res) => {
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

router.get('/blog', (req, res) => {
  res.sendFile(__dirname + '/src/blog.html');
});

router.get('/contact', (req, res) => {
  res.sendFile(__dirname + '/src/contact.html');
});

router.get('/submit-request', (req, res) => {
  res.sendFile(__dirname + '/src/submit-request.html');
});

router.get('/collection', (req, res) => {
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
    const { nftName, NFTdescription, NFTCollection, NFTPrice } = req.body;

    // get the current user using firebase auth
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if(user){
        const userEmail = user.email;
        console.log(userEmail);
      } else {
        console.log('User not logged in');
      }
    });
    const imgurl = FileController.uploadFile(req.file);
    console.log(imgurl.url);
    const storeNFTMetadata = NFTController.saveNFTMetadata(nftName, NFTdescription, imgurl.url, NFTPrice);
    console.log(storeNFTMetadata);
    res.status(200).json({message: 'NFT metadata saved to firestore'});
  } catch(err) {
    console.error(err);
    res.status(500).json({Error: `Failed to mint NFT: ${err}`});
  }
});

router.get('/getNFTS', (req, res) => {
  NFTController.getNFT(req, res);
})
router.get('/connect', (req, res) => {
  AuthController.verifyToken(req, res);
});

router.get('/users', async(req, res) => {
  await UsersController.getUsers(req, res);
});

router.get('/user/:id', async(req, res) => {
  UsersController.getUser(req, res);
});

// router.post( '/addfile', upload.single('file'), async(req, res) => {
//   FileController.uploadFile(req, res);
// });

router.get('/collections', async(req, res) => {
  NFTController.getCollections(req, res);
})

router.get('/nfts', async(req, res) => {
  NFTController.getNFTs(req, res);
})

router.get('/nft/:name', async(req, res) => {
  NFTController.getNFT(req, res);
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

router.get('/users/me', async(req, res) => {
UsersController.getUser(req, res);
});

// module.exports = router;
