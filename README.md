# Artlink NFT Marketplace
Artlink is a decentralized NFT marketplace that allows users to create, buy, and sell unique digital assets. The platform is built on top of a blockchain, providing users with a secure and transparent way to exchange NFTs.

## Features
Artlink offers the following features:

### Account Creation
Users can create an account on Artlink by providing their name, email address, and a password. Once the account is created, they can log in to the platform and start using its features.

### NFT Minting
Users can mint their own NFTs on Artlink by uploading their digital assets and filling out the necessary information. They can set a price for their NFT and put it up for sale on the platform.

### NFT Buying
Users can browse through the NFTs available on Artlink and purchase the ones they like. They can use a variety of payment methods to complete the transaction, including cryptocurrencies and credit/debit cards.

### Collection Tracking
Users can track their NFT collections on Artlink and view the NFTs they have purchased or created. They can also view the collections of other users on the platform.

## Getting Started
To get started with Artlink, follow these steps:

Visit the Artlink website and create an account.
Verify your email address and log in to the platform.
Browse through the NFTs available on Artlink or mint your own.
Purchase the NFTs you like or put your own up for sale.
Track your NFT collection and view other users' collections.

## How to run the web app
1. Clone the repository
2. Navigate to the project's directory
3. On your terminal, run ```npm install```
4. The application requires some environment variables to run. Create and put in the .env file these variables:
 - JWT secret key. This is used to sign JWT requests to authenticate users. For more information, read jwt.io
 - The Contract Address, which will be provided on request
 - Your wallet address where commission from NFT sales are deposited 
5. The project uses firebase for its database, storage and auth services.If you wish, you can also set up your own firebase project instead of using the base project for this app. This will give you greater control over the data flow and auth/storage processes. Alternatively, you can set up your own custom auth, of which the process will be documented in the backend folder's markdown.
6. Run ```npm run dev``` to start the server
7. Access the NFT Marketplace at http://localhost:5000 in your web browser.

## Conclusion
Artlink is a user-friendly and secure NFT marketplace that enables users to create, buy, and sell unique digital assets. The platform's decentralized nature ensures that all transactions are transparent and secure, providing users with a trustworthy way to exchange NFTs.
