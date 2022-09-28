import Web3 from "web3";

const web3Provider = () =>
  new Promise(async (resolve, reject) => {
    let provider;
    // Modern dapp browsers...
    if (window.ethereum) {
      provider = window.ethereum;
      try {
        // Request account access if needed
        await window.ethereum.enable();
      } catch (error) {
        reject(error);
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      // Use Mist/MetaMask's provider.
      provider = window.web3;
      console.log("Injected web3 detected.");
    }
    // Fallback to localhost; use dev console port by default...
    else {
      provider = new Web3.providers.HttpProvider("http://127.0.0.1:8545");
      console.log("No web3 instance injected, using Local web3.");
    }
    resolve(provider);
  });

export default web3Provider;
