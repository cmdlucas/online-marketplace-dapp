import { hexToString } from "web3-utils";

export const productsFetcher = sFID => {
    return new Promise(async (resolve, reject) => {
        if(window.dapp) {
            const { contracts: { StoreManager } } = window.dapp;
            try {
                // Get contract instance
                const instance = await StoreManager.deployed();
                // Get profiles according to type specified
                const products = await instance.getStoreFrontProducts.call(sFID);
                // extract profiles
                let allProducts = [];
                // get parameters from result
                const n = products[0].length;
                for(let i = 0; i < n; i++) {
                    let product = { 
                        pid: parseInt(products[0][i]),
                        productQty: parseInt(products[1][i]),
                        active: products[2][i],
                        name: hexToString(products[3][i])
                    };
                    allProducts.push(product);                    
                }
                resolve(allProducts);
            } catch (e) {
                reject(e);
            }
        }
        reject(`dApp not provisioned.`);
    })
}

export const productCreater = p => {
    return new Promise(async (resolve, reject) => {
        if(window.dapp) {
            const { contracts: { StoreManager }, defaultProfile } = window.dapp;
            try {
                // Get contract instance
                const instance = await StoreManager.deployed();
                // update contract state
                await instance.addProduct(
                    p.sFID, p.price, p.qty, p.name, p.imageId, 
                    { from: defaultProfile.addr }
                );
                resolve();
            } catch (e) {
                reject(e);
            }
        }
        reject(`dApp not provisioned.`);
    })
}

export const productUpdater = p => {
    return new Promise(async (resolve, reject) => {
        if(window.dapp) {
            const { contracts: { StoreManager }, defaultProfile } = window.dapp;
            try {
                // Get contract instance
                const instance = await StoreManager.deployed();
                // update contract state
                await instance.productUpdater(
                    p.pid, p.price, p.qty, { from: defaultProfile.addr }
                );
                resolve();
            } catch (e) {
                reject(e);
            }
        }
        reject(`dApp not provisioned.`);
    })
}

export const productActivator = (pid, status) => {
    return new Promise(async (resolve, reject) => {
        if(window.dapp) {
            const { contracts: { StoreManager }, defaultProfile } = window.dapp;
            try{
                // get contract instance
                const instance = await StoreManager.deployed();                
                // activate profile
                await instance.productActivator(pid, status, { from: defaultProfile.addr });
                resolve();
            } catch (e) {
                reject(e);
            }
        }
        reject(`dApp not provisioned.`)
    })
}