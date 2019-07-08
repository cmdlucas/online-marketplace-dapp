
export const shopOwnerAccBal = () => {
    return new Promise(async (resolve, reject) => {
        if(window.dapp) {
            const { contracts: { PurchaseManager }, defaultProfile: {addr} } = window.dapp;
            try {
                // Get contract instance
                const instance = await PurchaseManager.deployed();
                // Get user balance
                const balance = await instance.checkStoreOwnerBalance.call({ from: addr });
                resolve(parseInt(balance));
            } catch (e) {
                reject(e);
            }
        }
        reject(`dApp not provisioned.`);
    })
}

export const withdrawFunds = amt => {
    return new Promise(async (resolve, reject) => {
        if(window.dapp) {
            const { contracts: { PurchaseManager }, defaultProfile: {addr} } = window.dapp;
            try {
                // Get contract instance
                const instance = await PurchaseManager.deployed();
                // Get user balance
                console.log(amt)
                await instance.withdrawFunds(amt, { from: addr });
                resolve();
            } catch (e) {
                reject(e);
            }
        }
        reject(`dApp not provisioned.`);
    })
}