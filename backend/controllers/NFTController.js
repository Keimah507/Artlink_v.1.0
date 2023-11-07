import { Alchemy, Network } from 'alchemy-sdk';
import Formdata from 'form-data';
import axios from 'axios';
import fs from 'fs';
import { ethers } from'ethers';
import dotenv from 'dotenv';
import {collection, doc, getDocs, setDoc} from "firebase/firestore";
import {dbClient} from "../js/firebase";
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");


dotenv.config();
const config = {
    apikey: process.env.ALCHEMY_API_KEY,
    network : Network.ETH_MAINNET
}
const alchemy = new Alchemy(config);

const alchemyAppKey = process.env.ALCHEMY_API_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractAbi = process.env.CONTRACT_ABI;
const web3 = createAlchemyWeb3(alchemyAppKey)


export default class NFTController{
        static async saveNFTMetadata(name, description, imageurl, price){
        //     Get NFT metadata from router middleware then save to firestore
            const NFTmetadata = {
                name: name,
                description: description,
                image: imageurl,
                price: price,
            }
            try {
                const NFTDetails = doc(dbClient, 'NFTs', name);
                await setDoc(NFTDetails, NFTmetadata);
            } catch (err) {
                console.error(err);
            }
            return NFTmetadata;
        }
    // static async uploadImageToIPFS(imageBuffer){
    //     const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
    //     const data = new Formdata();
    //     data.append('file', imageBuffer);
        
    //     const response = await axios.post(url, data, {
    //         method: 'POST',
    //         maxContentLength: 'Infinity',
    //         Headers: {
    //             'Content-Type': `mutlipart/form-data`,
    //             'pinata_api_key': pinataKey,
    //             'pinata_secret_api_key': pinataSecret,  
    //         },
    //     });

    //     return response.data.IpfsHash;
    // }

    static async createNFT(nftname, NFTdescription, nftImageurl, nftPrice, walletAddress){
            const provider = new ethers.providers.AlchemyProvider('goerli', alchemyAppKey);
            const wallet = new ethers.Wallet(process.env.WALLET_PRIVATE_KEY)
            const contract = new ethers.Contract(contractAddress, contractAbi, wallet);


        
            const response = await contract.mintNFT(nftname, NFTdescription, nftImageurl, nftPrice, walletAddress);
            return response.hash;
    }


    static async getCollections(req, res) {
            const collectionMetadata = [];
            try {
                await fetch('https://api.rarible.org/v0.1/collections/all?blockchains=ETHEREUM', {
                    method: 'GET',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-KEY': process.env.RARIBLE_API_KEY,
                    }
                })
                .then(response => response.json())
                    // Check if response contains meta attribute and whether it is empty. If not empty, return the data attribute
                    .then(data => {
                        // console.log(data)
                        const metadata = data.collections.map(item => item.meta);
                        res.json({data: metadata})
                    })
            } catch(err){
                res.status(400).json({Error: `Internal Server Error ${err}`})
            }

    }

    static async getNFTs(req, res){
        // Fetch NFT metadata from firestore collection NFTs
        const NFTs = [];
        try {
            const snapshot = await getDocs(collection(dbClient, 'NFTs'));
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }
            snapshot.forEach(doc => {
                NFTs.push(doc.data());
            });
            res.status(200).json({data: NFTs});
        } catch (err) {
            console.error(err);
        }
    };

    //Fetch single NFT based on query param    
    static async getNFT(req, res){
        const nftName = req.params.name;
        try {
            const snapshot = await getDocs(collection(dbClient, 'NFTs'));
            if (snapshot.empty) {
                console.log('No matching documents.');
                return;
            }
            snapshot.forEach(doc => {
                if(doc.data().name == nftName){
                    res.status(200).json({data: doc.data()});
                }
            });
        } catch (err) {
            console.error(err);
        }
    }

    //Fetches NFTs By maker, who is defined in query param
    static async getNFTsByMaker(req, res){
        const maker = req.query.maker;
        sdk.auth(process.env.OPENSEA_API_KEY)
        sdk.retrieveListings({limit: '100', maker: maker, order_by: 'created_date', order: 'desc', chain: 'ethereum'})
        .then(({ data }) => res.status(200).json({data: data}))
        .catch(err => console.error(err));
    }
}