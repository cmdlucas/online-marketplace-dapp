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
        let storeFront, sI;
        try {
            // Create store front
            sI = await storeInstance.createStoreFront("Kitube Stores", { from: shopOwner });
            // Get store front details
            storeFront = await storeInstance.getStoreFronts.call(shopOwner, 0, 1);
            storeFrontId = parseInt(storeFront[0][0]);
        } catch (e) { }
        // the created store's id should be 0
        assert.equal(storeFrontId, 0, "The store front was not created.");
    });

    it("should not create a new store front if caller is not the store owner", async () => {
        let storeFront, sFID;
        try {
            // Create store front
            await storeInstance.createStoreFront("Kitube Stores", { from: shopOwnerTwo });
            // Get store front details
            storeFront = await storeInstance.getStoreFronts.call(shopOwner, 0, 1);
            sFID = storeFront[0][1];
        } catch (e) { }
        // the created store's id should be undefined
        assert.equal(sFID, undefined, "The store front was not created.");
    });

    it("should deactivate store front if store front owner calling", async () => {
        let storeFront;
        try {
            // Update store front
            await storeInstance.storeFrontActivator(storeFrontId, false, { from: shopOwner });
            // Check for store front details
            storeFront = await storeInstance.getStoreFrontDetails.call(storeFrontId);
        } catch (e) { }
        // the store front's details should have been updated by now
        assert.equal(storeFront.active, false, "The store front was not activated.");
    });

    it("should not activate store front if not store front owner calling", async () => {
        try {
            // Update store front
            await storeInstance.storeFrontActivator(storeFrontId, true, { from: shopOwnerTwo });
        } catch (e) { }
        try {
            // check for store front details
            storeFront = await storeInstance.getStoreFrontDetails.call(storeFrontId);
        } catch (e) { }
        // the store front's details should not have been updated
        assert.equal(storeFront.active, false, "The store front was activated.");
    });

    it("should activate store front if store front owner calling", async () => {
        let storeFront;
        try {
            // Update store front
            await storeInstance.storeFrontActivator(storeFrontId, true, { from: shopOwner });
            // check for store front details
            storeFront = await storeInstance.getStoreFrontDetails.call(storeFrontId);
        } catch (e) { }
        // the store front's details should not have been updated
        assert.equal(storeFront.active, true, "The store front was activated.");
    });

    it("should add a new product to the store front", async () => {
        try {
            // Create product
            await storeInstance.addProduct(storeFrontId, 300, 5, "Kitube Magnets", "1.jpg", 
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
            await storeInstance.addProduct(storeFrontId, 300, 5, "Kitube Magnets", "1.jpg", 
                    { from: shopOwnerTwo });
            // check for product details
            prodCount = await storeInstance.prodCount.call();
        } catch (e) { }
        // the created product count should still be 1
        assert.equal(prodCount, 1, "The store front was created.");
    });

    it("should update product if product owner calling", async () => {
        try {
            const prodId = prodCount - 1;
            // Update product
            await storeInstance.productUpdater(prodId, 250, 8, { from: shopOwner });
            // check for product details
            product = await storeInstance.getProductDetails.call(prodId);
        } catch (e) { }
        // the product's details should have been updated by now
        assert.equal(product.price, 250, "The product was not.");
    });

    it("should not update product if not product owner calling", async () => {
        try {
            const prodId = prodCount - 1;
            // Update product
            await storeInstance.productUpdater(prodId, 500, 6, { from: shopOwnerTwo });
            // check for product details
            product = await storeInstance.getProductDetails.call(prodId);
        } catch (e) { }
        // the product's details should not have been updated
        assert.equal(product.price, 250, "The product was updated.");
    });

    it("should deactivate product if product owner calling", async () => {
        try {
            const prodId = prodCount - 1;
            // Update product
            await storeInstance.productActivator(prodId, false, { from: shopOwner });
            // check for product details
            product = await storeInstance.getProductDetails.call(prodId);
        } catch (e) { }
        // the product's details should have been updated by now
        assert.equal(product.active, false, "The product was not activated.");
    });

    it("should not activate product if not product owner calling", async () => {
        try {
            const prodId = prodCount - 1;
            // Update product
            await storeInstance.productActivator(prodId, true, { from: shopOwnerTwo });
            // check for product details
            product = await storeInstance.getProductDetails.call(prodId);
        } catch (e) { }
        // the product's details should not have been updated
        assert.equal(product.active, false, "The product was activated.");
    });

    it("should activate product if product owner calling", async () => {
        try {
            const prodId = prodCount - 1;
            // Update product
            await storeInstance.productActivator(prodId, true, { from: shopOwner });
            // check for product details
            product = await storeInstance.getProductDetails.call(prodId);
        } catch (e) { }
        // the product's details should not have been updated
        assert.equal(product.active, true, "The product was activated.");
    });
    
})