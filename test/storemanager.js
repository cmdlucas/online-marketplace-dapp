const StoreManager = artifacts.require("StoreManager");
const UserProfileManager = artifacts.require("UserProfileManager");

// Test StoreManager's Logic
contract('StoreManager', async accounts => {
    const UserType = { Owner: 0, Admin: 1, ShopOwner: 2 }
    const [owner, admin, adminTwo, shopOwner, shopOwnerTwo] = accounts;

    before(async () => {
        // Create new shop owner profile so that we can test contract
        const userInstance = await UserProfileManager.deployed();
        try{
            await userInstance.addNewProfile(
                shopOwner, UserType.ShopOwner, "Lulu", "Hasna", { from: owner }
            );
        } catch (e) { }
        // get store contract instance
        storeInstance = await StoreManager.deployed();
    });

    let storeInstance, storeFrontId, prodCount;

    it("should create a new store front", async () => {
        let storeFront;
        try {
            // Create store front
            await storeInstance.createStoreFront("Kitube Stores", { from: shopOwner });
            // Get store front details
            storeFront = await storeInstance.getStoreFronts.call(shopOwner);
            storeFrontId = storeFront[0][0];
        } catch (e) { }
        // the created store's name should be Kitube Stores
        assert.equal(storeFrontId, 0, "The store front was not created.");
    });

    it("should not create a new store front if caller is not the store owner", async () => {
        let storeFront, sFID;
        try {
            // Create store front
            await storeInstance.createStoreFront("Kitube Stores", { from: shopOwnerTwo });
            // Get store front details
            storeFront = await storeInstance.getStoreFronts.call(shopOwner);
            sFID = storeFront[0][1];
        } catch (e) { }
        // the created store's name should be Kitube Stores
        assert.equal(sFID, undefined, "The store front was not created.");
    });

    it("should add a new product to the store front", async () => {
        try {
            // Create product
            await storeInstance.addProduct(storeFrontId, 300, 5, "Kitube Stores", "1.jpg", 
                    { from: shopOwner });
            // check for product details
            prodCount = await storeInstance.prodCount.call();
        } catch (e) { }
        // the created product count should be 1
        assert.equal(prodCount, 1, "The store front was not created.");
    });

    it("should not add a new product to the store front if not store owner calling", async () => {
        try {
            // Create product
            await storeInstance.addProduct(storeFrontId, 300, 5, "Kitube Stores", "1.jpg", 
                    { from: shopOwnerTwo });
            // check for product details
            prodCount = await storeInstance.prodCount.call();
        } catch (e) { }
        // the created product count should still be 1
        assert.equal(prodCount, 1, "The store front was created.");
    });
})