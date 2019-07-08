import { UserType } from "../constants/a.constant";
import { hexToString } from "web3-utils";

// Fetch all profiles

export const profilesFetcher = type => {
    return new Promise(async (resolve, reject) => {
        if (window.dapp) {
            const { contracts: { UserProfileManager }, accounts } = window.dapp;
            try {
                // Get contract instance
                const instance = await UserProfileManager.deployed();
                // Get profiles according to type specified
                let profiles;
                switch (type) {
                    case UserType.Admin:
                        profiles = await instance.getAdminsProfiles({ from: accounts[0] });
                        break;
                    case UserType.ShopOwner:
                        profiles = await instance.getShopOwnersProfiles({ from: accounts[0] });
                        break;
                    default:
                        break;
                }
                // extract profiles
                let allProfiles = [];
                // get parameters from result
                const n = profiles[0].length;
                for(let i = 0; i < n; i++) {
                    allProfiles.push({
                        addr: profiles[0][i],
                        active: profiles[1][i],
                        firstName: hexToString(profiles[2][i]),
                        lastName: hexToString(profiles[3][i]),
                        userType: parseInt(profiles[4][i])
                    });                    
                }
                resolve(allProfiles);
            } catch (e) {
                reject(e);
            }
        }
        reject(`dApp not provisioned.`);
    })
}

export const profileCreater = p => {
    return new Promise( async (resolve, reject) => {
        if(window.dapp) {
            const { contracts: { UserProfileManager }, defaultProfile } = window.dapp;
            try {
                // Get contract instance
                const instance = await UserProfileManager.deployed();
                // update contract state
                await instance.addNewProfile(
                    p.addr, p.userType, p.firstName, p.lastName, 
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

export const profileUpdater = p => {
    return new Promise(async (resolve, reject) => {
        if(window.dapp) {
            const { contracts: { UserProfileManager }, defaultProfile } = window.dapp;
            try {
                // Get contract instance
                const instance = await UserProfileManager.deployed();
                // update contract state
                await instance.updateProfile(
                    p.addr, p.userType, p.firstName, p.lastName, 
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

export const adminActivator = (reqType, address) => {
    return new Promise (async (resolve, reject) => {
        if(window.dapp) {
            const { contracts: { UserProfileManager }, defaultProfile } = window.dapp;
            try{
                // get contract instance
                const instance = await UserProfileManager.deployed();
                switch(reqType) {
                    case true: { // activate profile
                        await instance.activateAdmin(address, { from: defaultProfile.addr });
                        break;
                    }
                    default: { // deactivate profile
                        await instance.deActivateAdmin(address, { from: defaultProfile.addr });
                        break;
                    }
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        }
        reject(`dApp not provisioned.`);
    })
}

export const shopOwnerActivator = (reqType, address) => {
    return new Promise (async (resolve, reject) => {
        if(window.dapp) {
            const { contracts: { UserProfileManager }, defaultProfile } = window.dapp;
            try{
                // get contract instance
                const instance = await UserProfileManager.deployed();
                switch(reqType) {
                    case true: { // activate profile
                        await instance.activateShopOwner(address, { from: defaultProfile.addr });
                        break;
                    }
                    default: { // deactivate profile
                        await instance.deActivateShopOwner(address, { from: defaultProfile.addr });
                        break;
                    }
                }
                resolve();
            } catch (e) {
                reject(e);
            }
        }
        reject(`dApp not provisioned.`);
    })
}