const pinataSDK = require('@pinata/sdk');
const { createAlchemyweb3 }  = require('alchemy-sdk');
const alchemyKey = process.env.ALCHEMY_API_KEY;
const web3 = new createAlchemyweb3(alchemyKey);
require('dotenv').config();

const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET);

class NFTController {
    static async uploadToIPFS(file) {
        const options = {
            pinataMetadata: {
                name: file.name
            },
            pinataOptions: {
                cidVersion: 1
            }
        };
        const result = await pinata.uploadToIPFS(file, options);
        return result.IpfsHash;
    }

    static async mintNFT(name, imageFile, collection, description){
        const imageUrl = await uploadToIPFS(imageFile);

        const contract = new web3.eth.Contract(process.env.contractABI, process.env.contractAddress);

        const metadata = {
            name: name,
            image: imageUrl,
            collection: collection,
            description: description
        };

        const mintResult = await contract.methods.mint(metadata).send({ from: web3.eth.defaultAccount});
        console.log(`NFT minted with token ID: ${mintResult.events.Transfer.returnValues[2]}`);
    }

    static handleFileInputChange(event){
        const file = event.target.files[0];
        mintNFT('NFT1', file, "Collection1", "NULL&VOID");
    }

}

const fileInputElement = document.getElementById("file-input");
fileInputElement.addEventListener('change', handleFileInputChange);