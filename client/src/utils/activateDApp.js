import $ from 'jquery';
import TruffleContract from 'truffle-contract';
import webThreeProvider from "./web3Provider";
import getWeb3 from "./getWeb3";
import UserProfileManagerArtifact from "../contracts/UserProfileManager.json";
import StoreManagerArtifact from "../contracts/StoreManager.json";
import PurchaseManagerArtifact from "../contracts/PurchaseManager.json";
import userProfileSelector from './userProfileSelector';

const loadDAPP = (resolve, reject) => {
    return async () => {
        try {
            let dapp = { contracts: {}, defaultProfile: {} };

            // Get provider and web3 instance.
            const web3Provider = await webThreeProvider();
            const web3 = await getWeb3(web3Provider);

            // Use web3 to get the user's accounts.
            dapp.accounts = await web3.eth.getAccounts();

            // load contracts through their artifacts with truffle
            dapp.contracts.UserProfileManager = TruffleContract(UserProfileManagerArtifact);
            dapp.contracts.StoreManager = TruffleContract(StoreManagerArtifact);
            dapp.contracts.PurchaseManager = TruffleContract(PurchaseManagerArtifact);

            // set providers on trufflised contracts
            dapp.contracts.UserProfileManager.setProvider(web3Provider);
            dapp.contracts.StoreManager.setProvider(web3Provider);
            dapp.contracts.PurchaseManager.setProvider(web3Provider);

            // make dapp globally available
            window.dapp = dapp;

            // provision the account profiles
            await userProfileSelector();

            resolve();

        } catch (error) {
            // Catch any errors for any of the above operations.
            // Provisioning failed for either web3, accounts, or contract.
            reject(`Provisioning failed.`);
        }
    }
}

// activate dApp utilities and register on window object
export default function activateDApp(force = false) {
    return new Promise((resolve, reject) => {
        
        // reject if provisioned before and this call is not forced
        if (window.dapp && !force) {
            reject(
                new Error("dApp utils already provisioned. Access with `window.dapp` or use activateDApp(true) to force reprovision")
            );
        }

        // This is a fresh request so we fire after window is loaded
        if(!window.dapp && !force) {
            // register only when window has loaded to prevent racing 
            // situations with web3 injectors 
            $(window).on('load', loadDAPP(resolve, reject));
        }

        // This is a forced subsequent request so we fire immediately
        if(force) {
            loadDAPP(resolve, reject)();
        }
    });
}