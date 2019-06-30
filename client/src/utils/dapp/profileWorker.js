import { UserType } from "../constants/a.constant";
import { hexToString } from "web3-utils";

// Fetch all profiles

export const profilesFetcher = type => {
    return new Promise(async (resolve, reject) => {
        if (window.dapp) {
            const { contracts: { UserProfileManager } } = window.dapp;
            try {
                // Get contract instance
                const instance = await UserProfileManager.deployed();
                // Get profiles according to type specified
                let profiles;
                switch (type) {
                    case UserType.Admin:
                        profiles = await instance.getAdminsProfiles.call();
                        break;
                    case UserType.ShopOwner:
                        profiles = await instance.getShopOwnersProfiles.call();
                        break;
                    default:
                        break;
                }
                // extract profiles
                let allProfiles = [];
                // get parameters from result
                const n = profiles[0].length;
                for(let i = 0; i < n; i++) {
                    let profile = { 
                        addr: profiles[0][i],
                        active: profiles[1][i],
                        firstName: hexToString(profiles[2][i]),
                        lastName: hexToString(profiles[3][i]),
                        userType: profiles[4][i]
                    };
                    allProfiles.push(profile);                    
                }
                resolve(allProfiles);
            } catch (e) {
                reject(e);
            }
        }
    })
}