import $ from 'jquery';
import TruffleContract from 'truffle-contract';
import webThreeProvider from "./web3Provider";
import getWeb3 from "./getWeb3";
import SimpleStorageArtifact from "../contracts/SimpleStorage.json";

// activate dApp utilities and register on window object
export default function activateDApp(force = false) {
    return new Promise((resolve, reject) => {
        
        // reject if provisioned before and this call is not forced
        if (window.dapp && !force) {
            reject(
                new Error("dApp utils already provisioned. Access with `window.dapp` or use activateDApp(true) to force reprovision")
            );
        }

        // register only when window has loaded to prevent racing 
        // situations with web3 injectors 
        $(window).on('load', async () => {
            try {
                let dapp = { contracts: {} };

                // Get provider and web3 instance.
                const web3Provider = await webThreeProvider();
                const web3 = await getWeb3(web3Provider);

                // Use web3 to get the user's accounts.
                dapp.accounts = await web3.eth.getAccounts();

                // load contracts through their artifacts with truffle
                dapp.contracts.SimpleStorage = TruffleContract(SimpleStorageArtifact);

                // set providers on trufflised contracts
                dapp.contracts.SimpleStorage.setProvider(web3Provider);

                // make dapp globally available
                window.dapp = dapp;

                resolve();

            } catch (error) {
                // Catch any errors for any of the above operations.
                alert(`Provisioning failed for either web3, accounts, or contract. Check console for details.`);
                reject(error);
            }
        });
    });
}