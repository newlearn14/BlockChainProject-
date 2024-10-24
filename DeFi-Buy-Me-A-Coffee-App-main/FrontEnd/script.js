import abi from '../Front-end/utils/BuyMeACoffee.json';
import { ethers } from "ethers";
import Head from 'next/head'
import React, { useEffect, useState } from "react";
import styles from '../styles/Home.module.css'

// This javascript file is about the behaviour of the dApp made by me about cloning a defi version of buy-me-a-coffee

const contractAddress = "0x30F99eCb9DdD2C518D532D7e1f38246895C272c5";
const contractABI  = abi.abi;

console.log(abi);

const [currentAccount, setCurrentAccount] = useState("");
const [name, setName] = useState("");

const [message, setMessage] = useState("");
const [memos, setMemos] = useState([]);

const onNameChange = (event) => {
  setName(event.target.value);
}

const onMessageChange = (event) => {
  setMessage(event.target.value);
}

const isWalletConnected = async () => {
  try {
    const { ethereum } = window;
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    console.log("accounts: ", account);

    if(accounts.length > 0) {
      const accounts = accounts[0];
      console.log("Wallet is connected" + account);
    } else {
      console.log("Make sure that the Metamask is Connected!");
    }
  } catch (error) {
    console.log("error: ", error);
  }
}

// This Enables the Ability to connect the wallet(MetaMask) from the frontend to the backend by the Button

const connectWallet = async () => {
  try {
    const { ethereum } = window;

    if(!ethereum) {
      console.log("please install metamask");
    }

    const accounts = await ethereum.request({
      method: 'eth_requestAccounts'
    });

    setCurrentAccount(accounts[0]);
  } catch (error) {
    console.log(error);
  }
}

const buyCoffee = async () => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      const signer = provider.getSigner();
      const buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      console.log("buying coffee..")
      const coffeeTxn = await buyMeACoffee.buyCoffee(
        name ? name : "anon",
        message ? message : "Enjoy your coffee!",
        { value: ethers.utils.parseEther("0.001") }
      );

      await coffeeTxn.wait();

      console.log("mined ", coffeeTxn.hash);

      console.log("coffee purchased!");

      setName("");
      setMessage("");
    }
  } catch (error) {
    console.log(error);
  }
};

const getMemos = async () => {
  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const buyMeACoffee = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      console.log("fetching memos from the blockchain..");
      const memos = await buyMeACoffee.getMemos();
      console.log("fetched!");
      setMemos(memos);
    } else {
      console.log("Metamask is not connected");
    }

  } catch (error) {
    console.log(error);
  }
};

const onNewMemo = (from, timestamp, name, message) => {
  console.log("Memos Got: ", from, timestamp, name, message);
  setMemos
}