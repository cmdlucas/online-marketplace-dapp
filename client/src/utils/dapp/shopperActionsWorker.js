import { hexToString } from "web3-utils";

export const storeFrontsFetcher = () => {
    return new Promise(async (resolve, reject) => {
        if(window.dapp) {
            const { contracts: { StoreManager } } = window.dapp;
            try {
                // Get contract instance
                const instance = await StoreManager.deployed();
                
                // Get store fronts from shop owner specified
                const storeFronts = await instance.getSomeStoreFronts.call(0, 25);
                // extract profiles
                let allStoreFronts = [];
                // get parameters from result
                const n = storeFronts[0].length;
                for(let i = 0; i < n; i++) {
                    allStoreFronts.push({ 
                        sFID: parseInt(storeFronts[0][i]),
                        productQty: parseInt(storeFronts[1][i]),
                        active: storeFronts[2][i],
                        name: hexToString(storeFronts[3][i])
                    });                    
                }
                resolve(allStoreFronts);
            } catch (e) {
                reject(e);
            }
        }
        reject(`dApp not provisioned.`);
    })
}

export const productsFetcher = sFID => {
    return new Promise(async (resolve, reject) => {
        if(window.dapp) {
            const { contracts: { StoreManager } } = window.dapp;
            try {
                // Get contract instance
                const instance = await StoreManager.deployed();
                // Get products from store front specified
                const products = await instance.getStoreFrontProducts.call(sFID, 0, 25);
                // extract profiles
                let allProducts = [];
                // get parameters from result
                const n = products[0].length;
                for(let i = 0; i < n; i++) {
                    allProducts.push({ 
                        pid: parseInt(products[0][i]),
                        price: parseInt(products[1][i]),
                        productQty: parseInt(products[2][i]),
                        active: products[3][i],
                        name: hexToString(products[4][i]),
                        imageId: "1.jpg"
                    });                    
                }
                resolve(allProducts);
            } catch (e) {
                reject(e);
            }
        }
        reject(`dApp not provisioned.`);
    })
}

export const productsPurchaser = p => {
    return new Promise(async (resolve, reject) => {
        if(window.dapp) {
            const { contracts: { PurchaseManager } } = window.dapp;
            const { pid, sfid, qty } = p;
            try {
                // Get contract instance
                const instance = await PurchaseManager.deployed();
                // Buy product
                await instance.buyProduct(pid, qty, sfid, { value: 2 });
                resolve();
            } catch (e) {
                reject(e);
            }
        }
        reject(`dApp not provisioned.`);
    })
}