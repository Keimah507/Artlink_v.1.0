// import { AlchemyWeb3 } from "@alch/alchemy-web3";
// const AlchemyWeb3 = new AlchemyWeb3("fPMyl04y1VfYk_Gglf8LV4Y1EGZW8S0m");
// const contractAddress = "0xCB9058e0d9753bc10BF2fb75df3C70218Ff058D8";

async function getNFTSFromCollection() {
    const contractInstance = new AlchemyWeb3.eth.contract(process.env.CONTRACT_ABI, contractAddress);

    const totalTokens = await contractInstance.methods.totalSupply().call();

    const tokenIds = [];

    for (let i = 0; i < totalTokens; i++) {
        const tokenId = await contractInstance.methods.tokenByIndex(i).call();
        tokenIds.push(tokenId);
    }

    const tokens = [];

    for (let i = 0; i < tokenIds; i++) {
        const tokenURI = await contractInstance.methods.tokenURI(tokenIds[i]).call();
        const response = await fetch(tokenURI);
        const metadata = await response.json();

        tokens.push(metadata);
    }

    return tokens;
}

module.exports = getNFTSFromCollection;

async function displayCollection() {
    const nfts = await getAllNFTs();

    const template = Handlebars.compile(document.getElementById('collection-template').innerHTML);
    const html = template({ nfts });

    document.getElementById('collection').innerHTML = html;
}

displayCollection();

module.exports = displayCollection;