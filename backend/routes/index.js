import express from "express";
import UsersController from "../controllers/UsersController.js";
import AppController from "../controllers/AppController.js";
import AuthController from "../controllers/AuthController.js";
import WalletController from "../controllers/WalletController.js"
import path from "path";
const axios = require("axios");
const app = express();
const multer = require('multer');
const upload = multer({ 
   storage: multer.memoryStorage(),
   limits: { fileSize: 1024 * 1024 * 5}, // Max-size 5MB
});

const router = express.Router();
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
  res.sendFile(__dirname + "/src/collection.html");
});

router.get('/getstatus', (req, res) => {
  AppController.getStatus(req, res);
});

router.post('/register', upload.single('profileImg'), (req, res) => {
  UsersController.postNew(req, res);
});

router.post('/login', (req, res) => {
  UsersController.login(req, res);
});

router.post('/edit-profile', upload.single('profileImg'), (req, res) => {
  UsersController.updateUser(req, res);
})

router.get('/connect', (req, res) => {
  AuthController.verifyToken(req, res);
});

router.get('/users/me', AuthController.verifyToken, async(req, res) => {
UsersController.getUser(req, res);
});

// router.get('/users/me', AuthController.verifyToken, (req, res) => { 
//   res.redirect('/profile')
// })

module.exports = router;
