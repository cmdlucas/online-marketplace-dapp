import { hexToString } from "web3-utils";

export const storeFrontsFetcher = sFID => {
    return new Promise(async (resolve, reject) => {
        if(window.dapp) {
            const { contracts: { StoreManager } } = window.dapp;
            try {
                // Get contract instance
                const instance = await StoreManager.deployed();
                // Get profiles according to type specified
                const storeFronts = await instance.getStoreFronts.call(sFID);
                // extract profiles
                let allStoreFronts = [];
                // get parameters from result
                const n = storeFronts[0].length;
                for(let i = 0; i < n; i++) {
                    let storeFront = { 
                        sFID: parseInt(storeFronts[0][i]),
                        productQty: parseInt(storeFronts[1][i]),
                        active: storeFronts[2][i],
                        name: hexToString(storeFronts[3][i])
                    };
                    allStoreFronts.push(storeFront);                    
                }
                console.log(storeFronts);
                resolve(allStoreFronts);
            } catch (e) {
                reject(e);
            }
        }
        reject(`dApp not provisioned.`);
    })
}

export const storeFrontCreater = sF => {
    return new Promise(async (resolve, reject) => {
        if(window.dapp) {
            const { contracts: { StoreManager }, defaultProfile } = window.dapp;
            try {
                // Get contract instance
                const instance = await StoreManager.deployed();
                // update contract state
                await instance.createStoreFront(sF.name,  { from: defaultProfile.addr });
                resolve();
            } catch (e) {
                reject(e);
            }
        }
        reject(`dApp not provisioned.`);
    })
}

export const storeFrontActivator = (sFID, status) => {
    return new Promise(async (resolve, reject) => {
        if(window.dapp) {
            const { contracts: { StoreManager }, defaultProfile } = window.dapp;
            try{
                // get contract instance
                const instance = await StoreManager.deployed();                
                // activate profile
                await instance.storeFrontActivator(sFID, status, { from: defaultProfile.addr });
                resolve();
            } catch (e) {
                reject(e);
            }
        }
        reject(`dApp not provisioned.`)
    })
}