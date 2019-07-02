const StoreManager = artifacts.require("StoreManager");
const UserProfileManager = artifacts.require("UserProfileManager");

// Test StoreManager's Logic
contract('StoreManager', async accounts => {
    let storeInstance, sFID;
    const UserType = { Owner: 0, Admin: 1, ShopOwner: 2 }
    const [owner, admin, adminTwo, shopOwner, shopOwnerTwo] = accounts;

    before(async () => {
        // Create new shop owner profile so that we can test contract
        const userInstance = await UserProfileManager.deployed();
        try{
            await userInstance.addNewProfile(
                shopOwner, UserType.ShopOwner, "Lulu", "Hasna", { from: owner }
            );
        } catch (e) { console.log(e) }
        // get store contract instance
        storeInstance = await StoreManager.deployed();
    });

    it("should create a new store front", async () => {
        let storeFrondId, storeFront;
        try {
            // Create store front
            storeFrondId = await storeInstance.createStoreFront("Kitube Stores", { from: shopOwner });
            sFID = storeFrondId;
            // Get store front details
            storeFront = await storeInstance.getStoreFrontDetails.call(storeFrondId);
        } catch (e) { console.log(e); }
        // the created store's name should be Kitube Stores
        assert.equal(storeFront.name, "Kitube Stores", "The store front was not created.");
    });

    it("should not create a new store front if caller is not a store owner", async () => {
        let storeFrondId, storeFront;
        try {
            // Create store front
            storeFrondId = await storeInstance.createStoreFront("Kitube Stores", { from: admin });
            // Get store front details
            storeFront = await storeInstance.getStoreFrontDetails.call(storeFrondId);
        } catch (e) { console.log(e); }
        // no store front should have been created
        assert.equal(storeFront.name, undefined, "The profile was not created.");
    });

    it("should add a new product to the store front", async () => {
        let productId, product;
        try {
            // Create product
            productId = await storeInstance.addProduct(sFID, 300, 5, "Kitube Stores", "1.jpg", 
                    { from: shopOwner });
            // check for product details
            product = await storeInstance.getStoreFrontDetails.call(productId);
        } catch (e) { }
        // the created product's price should be 300
        assert.equal(product.price, 300, "The store front was not created.");
    });

    it("should not add a new product to the store front if not store owner calling", async () => {
        let productId, product;
        try {
            // Create product
            productId = await storeInstance.addProduct(sFID, 300, 5, "Kitube Stores", "1.jpg", 
                    { from: shopOwnerTwo });
            // check for product details
            product = await storeInstance.getStoreFrontDetails.call(productId);
        } catch (e) { }
        // the created store's name should be Kitube Stores
        assert.equal(product.price, 300, "The store front was not created.");
    });
})