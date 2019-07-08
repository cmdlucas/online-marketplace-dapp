const UserIdentity = artifacts.require("UserIdentity");

contract('UserIdentity', async accounts => {
    let instance;
    const UserType = { Owner: 0, Admin: 1, ShopOwner: 2 }
    const [owner, admin, adminTwo, shopOwner, shopOwnerTwo] = accounts;

    before(async () => {
        instance = await UserIdentity.deployed();
    });

    it("should set contract deployer as admin", async () => {
        // Get identity
        const isAdmin = await instance.admin.call(owner);
        // After deployment, deployer should be the an admin
        assert.equal(isAdmin, true, "The identity was not set.");
    });

    it("should set admin identity if owner calling", async () => {
        try {
            // Set new admin identity
            await instance.setAdminAddress(
                owner, admin, { from: owner }
            );
        } catch (e) { }
        // check if account is now admin
        const isAdmin = await instance.admin.call(admin);
        // idientity should be set to admin
        assert.equal(isAdmin, true, "The identity was not set.");
    });

    it("should not set admin identity if not owner calling", async () => {
        try {
            // Set new admin identity
            await instance.setAdminAddress(
                admin, adminTwo, { from: admin }
            );
        } catch (e) { }
        // check if account is now admin
        const isAdmin = await instance.admin.call(adminTwo);
        // idientity should not be set to admin
        assert.equal(isAdmin, false, "The identity was set.");
    });

    it("should set shop owner identity if admin calling", async () => {
        try {
            // Set new shop owner identity
            await instance.setShopOwnerAddress(
                admin, shopOwner, { from: admin }
            );
        } catch (e) { }
        // check if account is now shop owner
        const isShopOwner = await instance.shop_owner.call(shopOwner);
        // idientity should be set to shop owner
        assert.equal(isShopOwner, true, "The identity was not set.");
    });

    it("should not set shop owner identity if not admin calling", async () => {
        try {
            // Set new shop owner identity
            await instance.setShopOwnerAddress(
                shopOwner, shopOwnerTwo, { from: shopOwner }
            );
        } catch (e) { }
        // check if account is now shop owner
        const isShopOwner = await instance.shop_owner.call(shopOwnerTwo);
        // idientity not should be set to shop owner
        assert.equal(isShopOwner, false, "The identity was not set.");
    });

})