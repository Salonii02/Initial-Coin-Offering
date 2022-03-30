import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {Contract, providers, ethers, utils, BigNumber} from 'ethers'
import React,{useState,useEffect,useRef} from 'react'
import Web3Modal from 'web3modal';
import {
   TOKEN_CONTRACT_ADDRESS,
   TOKEN_CONTRACT_ABI
} from '../constants'
export default function Home() {
  const zero = BigNumber.from(0);
  const [walletConnected,setWalletConnected]=useState(false);
  const [loading, setLoading] = useState(false);
  const [tokensToBeClaimed, setTokensToBeClaimed] = useState(zero);
  const [amountOfTokens, setAmountOfTokens]=useState(zero);
  const [mintedCDTokens,setMintedCDTokens]=useState(zero);
  const [totalMintedTokens, setTotalMintedTokens] = useState(zero);
  const web3ModalRef=useRef();
  const connectWallet = async () => {
      try {
        await getProviderOrSigner();
        setWalletConnected(true);
      } catch (error) {
        console.log(error);
      }
  } 
  const getProviderOrSigner = async (needSigner = false) => {
       const provider = web3ModalRef.current.connect();
       const web3Provider = providers.Web3Provider(provider);

       const { chainId } = web3Provider.getNetwork();
       if(chainId != 4){
        window.alert("Change the network to Rinkeby");
        throw new Error("Change network to Rinkeby");
       }
       if(needSigner){
         const signer = web3Provider.getSigner();
         return signer;
       }
       return web3Provider;
  }
  const mintCDTokens = async () => {
    try{
      const signer = await getProviderOrSigner(true);
      const cryptoDevContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );
      const tokenPrice = await cryptoDevContract.tokenPrice();
      const value = tokenPrice*amountOfTokens;
      const tx = await cryptoDevContract.mint((amountOfTokens),{
        value: utils.parseEther(value.toString()),
        });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("You successfully minted Crypto Dev Tokens!");
    }catch (error) {
      console.log(error);
    }
  }
  const claimCDTokens = async () => {
  try{
      const signer = await getProviderOrSigner(true);
      const cryptoDevContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );
      const tx = await cryptoDevContract.claim();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert("You successfully claimed Crypto Dev Tokens!");
    }catch (error) {
      console.log(error);
    }
  }
  const getCDTokensOfCurrentUSer = async () => {
    try {
      const provider = await getProviderOrSigner(true);
      const cryptoDevContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider,
    );
      // We will need signer to extract the address of the 
      // currently connected Metamask
      const signer = await getProviderOrSigner(true);
      const address=signer.getAddress();
      const balanceofCD= await cryptoDevContract.balanceOf(address);
      setMintedCDTokens(balanceofCD);
    } catch (error) {
      console.log(error);
      setMintedCDTokens(zero);
    }
  }
  const getTokensToBeClaimed = async () => {
    try {
      const provider = await getProviderOrSigner();
      const tokenContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        provider
      );
      const _tokensTobeClaimed = tokenContract.tokensToBeClaimed();
      setTokensToBeClaimed(_tokensTobeClaimed);
    } catch (error) {
      console.log(error);
    }
  }
  const getTotalTokensMinted = async () => {
    try{
      const provider = await getProviderOrSigner();
      const cryptoDevContract = new Contract(
        TOKEN_CONTRACT_ADDRESS,
        TOKEN_CONTRACT_ABI,
        signer
      );
      const totalSupply = await cryptoDevContract.totalSupply();
      setTotalMintedTokens(totalSupply);
    }catch(error){
      console.log(error);
    }
  }
  useEffect(() => {
    if(!walletConnected){
       web3ModalRef.current=new Web3Modal({
        network:"rinkeby",
        providerOptions:{},
        disableInjectedProvider:false,
       });
       connectWallet();
       getCDTokensOfCurrentUSer();
       getTotalTokensMinted();
       getTokensToBeClaimed();
    }

  }, [walletConnected]);
  const renderButton = () => {
    if(loading){
      return(
        <div>
          <button className={styles.button}>Loading ....</button>
        </div>
      );
    }
    if(!walletConnected){
      return(
        <div>
          <button className={styles.button}> 
            Connect Your Wallet First
          </button>
        </div>
      );
    }
    if(walletConnected){
       if(tokensToBeClaimed > 0){
         return (
            <div>
              <div className={styles.description}>
                {tokensToBeClaimed*10} tokens can be claimed!!
              </div>
              <button className={styles.button} onClick={claimCDTokens}>
                Claim
              </button>
            </div>
         );
       }
       return(
            <div>
            <div className={styles.description}>
                {/* Format Ether helps us in converting a BigNumber to string */}
                You have minted {utils.formatEther(mintedCDTokens)}{" "}
                Crypto Dev Tokens
              </div>
              <div className={styles.description}>
                {/* Format Ether helps us in converting a BigNumber to string */}
                Overall {utils.formatEther(totalMintedTokens)}/10000 have been
                minted!!!
              </div>
            <div style={{ display:"flex-col" }}>
                  <div>
                    <input
                        type="number"
                        placeholder="Amount of Tokens"
                        onChange={(e) => setAmountOfTokens(BigNumber.from(e.target.value))}
                        className={styles.input}
                     />
                  </div>
                  <button 
                  className={styles.button} 
                  disabled={!(amountOfTokens>0)}
                  onClick={() => mintCDTokens(amountOfTokens)}
                  >
                  Mint Tokens
                  </button>
            </div>
            </div>
       );
    }
  }
  return (
    <div>
      <Head>
        <title>Crypto Devs</title>
        <meta name="description" content="ICO-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
         <div>
            <h1 className={styles.title}> Welcome to Crypto Devs ICO</h1>
            <div className={styles.description}> You can claim or mint Crypto Dev tokens here </div>
         </div>
         <div>
            <img className={styles.image} src="./0.svg" />
         </div>
      </div>
      <footer className={styles.footer}>
        Made with &#10084; by Crypto Devs
      </footer>
    </div>
  )
}
