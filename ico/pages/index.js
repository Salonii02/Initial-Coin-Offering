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
  const [loading, setLoading] = useState(false);
  const [tokensToBeClaimed, setTokensToBeClaimed] = useState(zero);
  const [walletConnected,setWalletConnected]=useState(false);
  const [amountOfTokens, setAmountOfTokens]=useState(zero);
  const [mintedCDTokens,setMintedCDTokens]=useState(zero);
  const [totalMintedTokens, setTotalMintedTokens] = useState(zero);
  const web3ModalRef=useRef();
  const connectWallet = async () => {

  } 
  const getProviderOrSigner = async () => {

  }
  const mintCDTokens = async () => {

  }
  const claimCDTokens = async () => {

  }
  const getCDTokensOfCurrentUSer = async () => {

  }
  const getTokensClaimedByCurrentUser = async () => {

  }
  const getTotalTokensMinted = async () => {

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
    }

  }, [walletConnected])
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
