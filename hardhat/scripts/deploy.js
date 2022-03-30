const { ethers }  = require("hardhat");
require("dotenv").config({ path: ".env" });
const { CRYPTO_DEVS_NFT_CONTRACT_ADDRESS } = require("../constants");
async function main() {
    const cryptoDevNFTContract = CRYPTO_DEVS_NFT_CONTRACT_ADDRESS;
    const cryptoDevTokenContract = await ethers.getContractFactory("CryptoDevToken");
    const deployedCryptoDevTokenContract = await cryptoDevTokenContract.deploy(
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