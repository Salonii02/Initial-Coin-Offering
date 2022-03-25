const { ethers }  = require("hardhat");
const { CRYPTO_DEVS_NFT_CONTRACT_ADDRESS } = require("../constants");
async function main() {
    const cryptoDevNFTContract = CRYPTO_DEVS_NFT_CONTRACT_ADDRESS;
    const cryptoDevsTokenContract = await ethers.getContractFactory("CryptoDevToken");
    const deployedCryptoDevTokenContract = await cryptoDevNFTContract.deploy(
        cryptoDevNFTContract
    );
    // await deployedCryptoDevTokenContract.deployed();
    console.log(
        "Crypto Devs Token Contract Address",
         deployedCryptoDevTokenContract.address
    );

}
main()
.then(() => process.exit(0))
.catch((error) => {
    console.log(error);
    process.exit(1);
})