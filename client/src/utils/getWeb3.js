import Web3 from "web3";

const getWeb3 = (web3Provider) =>
  new Promise((resolve, reject) => {
    try {
      resolve(new Web3(web3Provider));
    } catch (e) {
      reject(e);
    }
  });

export default getWeb3;
