// Remember to uncomment the code in the index.js file

//legacy code - Change createWriteStream function to storage.bucket.upload() function
import { Storage } from '@google-cloud/storage';
import multer from 'multer';
import fs  from 'fs';
import path from 'path';

const storage  = new Storage({
    projectId: 'nft-marketplace-e6568',
    keyFilename: './nft-marketplace-e6568-firebase-adminsdk-29b23-80e6ec2c2e.json',
});
const bucketname = 'nft-marketplace-e6568.appspot.com';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 1024 * 1024 * 5}, // Max-size 5MB
});

export default class FileController{
    static uploadFile(file){
        // upload a file to GCS from the client
            const folderName = 'nftImages';
            const fileName = `${folderName}/${file.originalname}`;
            const buffer = file.buffer;
            if (file) {
                try {
                    const bucket = storage.bucket(bucketname);
                    const blob = bucket.file(fileName);
                    const blobStream = blob.createWriteStream({
                        resumable: false,
                        metadata: {
                            contentType: file.mimetype
                        },
                    });
                    blobStream.on('error', (err) => {
                        console.log(`Error: Cannot upload file ${err}`);
                    });
                    blobStream.on('finish', async() => {
                        await blob.makePublic();
                        const filePath = `https://storage.googleapis.com/nftImages/${bucket.name}/${blob.name}`;
                        console.log(`File uploaded to ${filePath}.`);
                    });
                    blobStream.end(buffer);
                } catch (err) {
                    return {error: err.message};
                }
            }
            const filePath = `https://storage.googleapis.com/nftImages/${bucketname}/${file.originalname}`;
            return {url: filePath};
    }
}