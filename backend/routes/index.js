import express from "express";
import UsersController from "../controllers/UsersController.js";
import AppController from "../controllers/AppController.js";
import AuthController from "../controllers/AuthController.js";
import WalletController from "../controllers/WalletController.js"
import path from "path";
import { async } from "@firebase/util";
const axios = require("axios");
const app = express();

const router = express.Router();
const __dirname = path.resolve();

// function makeRequest(url, headers) {
//   return axios.get(url, {headers})
//   .then(response => {
//     return response.data;
//   })
//   .catch(err => {
//     console.error(err);
//     throw new Error('Unable to make request')
//   })
// }
  
router.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html');
});
  
router.get('/register', (req, res) => {
  res.sendFile(__dirname + '/src/register.html');
});

router.get('/login', (req, res) => {
  res.sendFile(__dirname + '/src/login.html');
});

router.get('/marketplace', (req, res) => {
  res.sendFile(__dirname + '/src/index-2.html');
});

router.get('/collection', (req, res) => {
  res.sendFile(__dirname + '/src/collection.html');
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

router.get('/connect-wallet',(req, res) => {
  WalletController.connectWallet(req, res);
});

router.get('/privacy', (req, res) => {
  res.sendFile(__dirname + '/src/privacy.html');
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

router.get('/collection', AuthController.verifyToken, (req, res) => {
  res.sendFile(__dirname + "/src/collection.html");
});

router.get('/getstatus', (req, res) => {
  AppController.getStatus(req, res);
});

router.post('/register', (req, res) => {
  UsersController.postNew(req, res);
});

router.post('/login', (req, res) => {
  UsersController.login(req, res);
});

router.get('/connect', (req, res) => {
  AuthController.verifyToken(req, res);
});

router.get('/profile/:id', AuthController.verifyToken, async(req, res) => {
UsersController.getUser(req, res);
});

module.exports = router;
