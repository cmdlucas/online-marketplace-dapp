const UserProfileManager = artifacts.require("UserProfileManager");

// Test UserManager Logic
// Ensure to run test only when you have up to 5 accounts in your wallet provider
contract("UserProfileManager", async accounts => {
    let instance;
    const UserType = { Owner: 0, Admin: 1, ShopOwner: 2 }
    const [owner, admin, adminTwo, shopOwner, shopOwnerTwo] = accounts;

    beforeEach(async () => {
        instance = await UserProfileManager.deployed();
    });

    it("should set app owner profile on deployment", async () => {
        // Get profile
        const profile = await instance.getUserProfile.call(owner);
        // After deployment, app owner should have a profile with Caleb as firstName
        assert.equal(profile.firstName, "Caleb", "The profile was not created.");
    });

    it("should update app owner profile ", async () => {
        try {
            // Set owner profile
            await instance.updateProfile(
                owner, UserType.Owner, "Kay", "Lucas", { from: owner }
            );
        } catch (e) { }
        // Get updated profile
        const profile = await instance.getUserProfile.call(owner);
        // App owner profile's firstName should have changed to Kay
        assert.equal(profile.firstName, "Kay", "The profile was not updated.");
    });

    it("should not update app owner profile if not owner calling", async () => {
        try {
            // Set owner profile
            await instance.updateProfile(
                owner, UserType.Owner, "Ifeanyi", "Lucas", { from: admin }
            );
        } catch (e) { }
        // Get updated profile
        const profile = await instance.getUserProfile.call(owner);
        // App owner profile's firstName should stay as Kay
        assert.equal(profile.firstName, "Kay", "The profile did not stay the same.");
    });

    it("should add new profile for admin", async () => {
        try {
            // Set new admin profile
            await instance.addNewProfile(
                admin, UserType.Admin, "Chief", "Okigbe", { from: owner }
            );
        } catch (e) { }
        // Get updated profile
        const profile = await instance.getUserProfile.call(admin);
        // This admin's profile firstName should be Chief
        assert.equal(profile.firstName, "Chief", "The profile was not created.");
    });

    it("should not add new admin profile if not app owner calling", async () => {
        try {
            // Set new admin profile
            await instance.addNewProfile(
                adminTwo, UserType.Admin, "Sema", "Tegbana", { from: admin }
            );
        } catch (e) { }
        // Get updated profile
        const profile = await instance.getUserProfile.call(admin);
        // New admin's profile should not have been created
        assert.notEqual(profile.firstName, "Sema", "The profile was created.");
    });

    it("should update admin profile", async () => {
        try {
            // Update admin profile
            await instance.updateProfile(
                admin, UserType.Admin, "Adams", "Okigbe", { from: admin }
            );
        } catch (e) { }
        // Get updated profile
        const profile = await instance.getUserProfile.call(admin);
        // This admin's profile firstName should be changed to Adams
        assert.equal(profile.firstName, "Adams", "The profile was not updated.");
    });

    it("should not update admin profile if not profile owner", async () => {
        try {
            // Update admin profile
            await instance.updateProfile(
                admin, UserType.Admin, "Chuks", "Okigbe", { from: shopOwner }
            );
        } catch (e) { }
        // Get updated profile
        const profile = await instance.getUserProfile.call(admin);
        // This admin's profile firstName should stay as Adams
        assert.equal(profile.firstName, "Adams", "The profile did not stay the same.");
    });

    
    it("should deactivate admin", async () => {
        try {
            // Deactive admin
            await instance.deActivateAdmin( admin, { from: owner } );
        } catch (e) { }
        // Get updated profile
        const profile = await instance.getUserProfile.call(admin);
        // This admin's profile should have been deactivated
        assert.equal(profile.active, false, "The profile was not deactivated.");
    });

    it("should activate admin", async () => {
        try {
            // Deactive admin
            await instance.activateAdmin( admin, { from: owner } );
        } catch (e) { }
        // Get updated profile
        const profile = await instance.getUserProfile.call(admin);
        // This admin's profile should have been activated
        assert.equal(profile.active, true, "The profile was not activated.");
    });

    it("should create new profile for shop owner", async () => {
        try {
            // Create new shop owner profile
            await instance.addNewProfile(
                shopOwner, UserType.ShopOwner, "Lulu", "Hasna", { from: admin }
            );
        } catch (e) { }
        // Get updated profile
        const profile = await instance.getUserProfile.call(shopOwner);
        //A new shopOwner should have been created with Lulu as firstName
        assert.equal(profile.firstName, "Lulu", "The profile was not created.");
    });

    it("should not create new profile for shop owner if not admin calling", async () => {
        try {
            // Create new shop owner profile
            await instance.addNewProfile(
                shopOwnerTwo, UserType.ShopOwner, "Toke", "Bawa", { from: shopOwner }
            );
        } catch (e) { }
        // Get updated profile
        const profile = await instance.getUserProfile.call(shopOwnerTwo);
        // Shop owner's profile should not have been created
        assert.notEqual(profile.firstName, "Toke", "The profile was created.");
    });

    it("admin should be able to update shop owner profile", async () => {
        try {
            // Create new admin profile
            await instance.updateProfile(
                shopOwner, UserType.ShopOwner, "Tami", "Hasna", { from: admin }
            );
        } catch (e) { }
        // Get updated profile
        const profile = await instance.getUserProfile.call(shopOwner);
        // Shop Owner's profile firstName should have changed to Tami
        assert.equal(profile.firstName, "Tami", "The profile was not updated.");
    });

    it("shop owner should be able to update own profile", async () => {
        try {
            // Create new shop owner profile
            await instance.updateProfile(
                shopOwner, UserType.ShopOwner, "Ketura", "Hasna", { from: shopOwner }
            );
        } catch (e) { }
        // Get updated profile
        const profile = await instance.getUserProfile.call(shopOwner);
        // Shop Owner's profile firstName should have changed to Keturah
        assert.equal(profile.firstName, "Ketura", "The profile was not updated.");
    });

    it("should deactivate shopowner", async () => {
        try {
            // Deactive shop owner
            await instance.deActivateShopOwner( shopOwner, { from: admin } );
        } catch (e) { }
        // Get updated profile
        const profile = await instance.getUserProfile.call(shopOwner);
        // This shop owner's profile should have been deactivated
        assert.equal(profile.active, false, "The profile was not deactivated.");
    });

    it("should activate admin", async () => {
        try {
            // Deactive admin
            await instance.activateShopOwner( shopOwner, { from: admin } );
        } catch (e) { }
        // Get updated profile
        const profile = await instance.getUserProfile.call(shopOwner);
        // This shop owner's profile should have been activated
        assert.equal(profile.active, true, "The profile was not activated.");
    });

    it("shop owner should not be able to update another shop owner's profile", async () => {
        try {
            // Create new shop owner profile
            await instance.addNewProfile(
                shopOwnerTwo, UserType.ShopOwner, "Tora", "Bana", { from: admin }
            );
        } catch (e) { }
        try {
            // Update shop owner profile
            await instance.updateProfile(
                shopOwnerTwo, UserType.ShopOwner, "Cali", "Bana", { from: shopOwner }
            );
        } catch (e) { }
        // Get updated profile
        const profile = await instance.getUserProfile.call(shopOwnerTwo);
        // new shop owner's profile should remain as Tora
        assert.equal(profile.firstName, "Tora", "The profile was updated.");
    });

    it("should return all the admin profiles created thus far", async () => {
        let profiles;
        try {
            profiles = await instance.getAdminsProfiles.call();
        } catch (e) { }
        // This shop owner's profile should have been activated
        assert.equal(profiles[1].length, 1, "The profiles returned don't match those created thus far.");
    });

    it("should return all the shop owners profiles created thus far", async () => {
        let profiles;
        try {
            profiles = await instance.getShopOwnersProfiles.call();
        } catch (e) { }
        // This shop owner's profile should have been activated
        assert.equal(profiles[1].length, 2, "The profiles returned don't match those created thus far.");
    });

});
