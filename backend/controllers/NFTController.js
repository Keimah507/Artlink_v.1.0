import { Alchemy, Network } from 'alchemy-sdk';
import Formdata from 'form-data';
import axios from 'axios';
import fs from 'fs';
import { ethers } from'ethers';
import dotenv from 'dotenv';
// import sdk from ('api')('@opensea/v2.0#9eqy6x159l3n6xcgf');

dotenv.config();
const config = {
    apikey: process.env.ALCHEMY_API_KEY,
    network : Network.ETH_MAINNET
}
const alchemy = new Alchemy(config);

const pinataKey = process.env.PINATA_KEY;
const pinataSecret = process.env.PINATA_SECRET;
const alchemyAppKey = process.env.ALCHEMY_API_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;
const contractAbi = process.env.CONTRACT_ABI;

export default class NFTController{
    static async uploadImageToIPFS(imageBuffer){
        const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
        const data = new Formdata();
        data.append('file', imageBuffer);
        
        const response = await axios.post(url, data, {
            method: 'POST',
            maxContentLength: 'Infinity',
            Headers: {
                'Content-Type': `mutlipart/form-data`,
                'pinata_api_key': pinataKey,
                'pinata_secret_api_key': pinataSecret,  
            },
        });

        return response.data.IpfsHash;
    }

    static async createNFT(nftname, NFTdescription, nftImageIpfsHash, nftPrice, walletAddress){
            const provider = new ethers.providers.AlchemyProvider('goerli', alchemyAppKey);
            const wallet = new ethers.Wallet(process.env.WALLET_KEY)
            const contract = new ethers.Contract(contractAddress, contractAbi, wallet);
        
            const response = await contract.mintNFT(nftname, NFTdescription, nftImageIpfsHash, nftPrice, walletAddress);
            return response.hash;
    }
    //ALCHEMY SDK getNFTsFromCollection function

    static async getNFT(req, res){
        const address = "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D";
        const omitMetadata = false;

        try {
        const { nfts } = await alchemy.nft.getNftsForContract(address, {
            omitMetadata: omitMetadata,
        });
        const imageUrls = [];
        let i = 1;
        for (let nft of nfts){
            imageUrls.push(nft.rawMetadata.image);
        }
        res.render('collection', { imageUrls: imageUrls });
        // res.status(200).json({imageUrls})
    } catch(err){
        res.status(400).json({Error: `Internal Server Error ${err}`})
    }

    };
    // static async getNFT(req, res){
    //     sdk.retrieveListingsTestnets({limit: '1'})
    //     .then(({ data }) => res.status(200).json({data: data}))
    //     .catch(err => console.error(err));
    // }
}