// Set the type of account we're currently dealing with

const userProfileSelector = async () => {
    if (window.dapp) {
        const { contracts: { UserProfileManager }, accounts } = window.dapp;
        let profiles = [];
        try {
            // Get contract instance
            const instance = await UserProfileManager.deployed();
            // provide all profiles available with accounts
            // so that, in the future, we can all our users switch profile
            for(let i = 0; i < accounts.length; i++) {
                const address = accounts[i];
                // get profile from address
                const profile = await instance.getUserProfile.call(address);
                // don't add profile if we get an address equivalent to 0
                if (parseInt(profile.addr, 16) !== 0) {
                    profiles.push({
                        firstName: `${profile.firstName}`,
                        lastName: `${profile.lastName}`,
                        userType: parseInt(profile.userType),
                        addr: `${profile.addr}`,
                        active: profile.active
                    });
                }
            }
            // store all the available profiles
            window.dapp.profiles = profiles;
            // choose the default profile
            window.dapp.defaultProfile = (profiles.length > 0) ? profiles[0] : {};
        } catch (e) {
            console.log(e);
        }
    }
}

export default userProfileSelector;