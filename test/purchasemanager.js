const UserProfileManager = artifacts.require("UserProfileManager");
const StoreManager = artifacts.require("StoreManager");
const PurchaseManager = artifacts.require("PurchaseManager");

// Test PurchaseManager's Logic
// Here we're testing: 
// 1. buying products
// 2. withdrawal of funds
// 3. checking user account balance
contract('PurchaseManager', async accounts => {
    const UserType = { Owner: 0, Admin: 1, ShopOwner: 2 }
    const [owner, admin, adminTwo, shopOwner, shopOwnerTwo] = accounts;

    let purchaseInstance, storeFrontId;

    before(async () => {
        // Create new shop owner profile so that we can test contract
        const userInstance = await UserProfileManager.deployed();
        const storeInstance = await StoreManager.deployed();
        try{
            await userInstance.addNewProfile(
                shopOwner, UserType.ShopOwner, "Lulu", "Hasna", { from: owner }
            );
        } catch (e) { }
        // Create store front as well as products so that we can test contract
        try{
            await storeInstance.createStoreFront("Kitube Stores", { from: shopOwner });
            // Get store front details
            const storeFront = await storeInstance.getStoreFronts.call(shopOwner, 0, 1);
            storeFrontId = parseInt(storeFront[0][0]);
            await storeInstance.addProduct(storeFrontId, 2, 5, "Kitube Magnets", "1.jpg", 
                    { from: shopOwner });
        } catch (e) { }
        // get purchase contract instance
        purchaseInstance = await PurchaseManager.deployed();
    });

    it("should allow any shopper to buy product if the funds supplied is sufficient", async () => {
        let balance;
        try {
            // buy product
            await purchaseInstance.buyProduct(0, 1, storeFrontId, { value: 2 });
        } catch (e) { }
        try {
            // get store owner's account balance
            balance = parseInt(await purchaseInstance.checkStoreOwnerBalance.call({ from: shopOwner }));            
        } catch (e) { }
        // the store owner's balance should have increased
        assert.equal(balance, 2, "The product was not bought.");
    });

    it("should not allow product to be bought if the funds supplied is insufficient", async () => {
        let balance;
        try {
            // buy product
            await purchaseInstance.buyProduct(0, 1, storeFrontId, { value: 0 });
        } catch (e) { }
        try {
            // get store owner's account balance
            balance = parseInt(await purchaseInstance.checkStoreOwnerBalance.call({ from: shopOwner }));            
        } catch (e) { }
        // the store owner's balance should stay the same
        assert.equal(balance, 2, "The product was bought.");
    });

    it("should not allow product to be bought if the quantity requested is higher than the qty available", async () => {
        let balance;
        try {
            // buy product
            await purchaseInstance.buyProduct(0, 7, storeFrontId, { value: 1 * 7 });
        } catch (e) { }
        try {
            // get store owner's account balance
            balance = parseInt(await purchaseInstance.checkStoreOwnerBalance.call({ from: shopOwner }));            
        } catch (e) { }
        // the store owner's balance should stay the same
        assert.equal(balance, 2, "The product was bought.");
    });

    it("should not withdraw if sum is zero", async () => {
        let balance;
        try {
            // buy product
            await purchaseInstance.withdrawFunds(0, { from: shopOwner });
        } catch (e) { }
        try {
            // get store owner's account balance
            balance = parseInt(await purchaseInstance.checkStoreOwnerBalance.call({ from: shopOwner }));            
        } catch (e) { }
        // the store owner's balance should stay the same
        assert.equal(balance, 2, "The sum was withdrawn.");
    });

    it("should not withdraw if balance is lower than sum", async () => {
        let balance;
        try {
            // buy product
            await purchaseInstance.withdrawFunds(5, { from: shopOwner });
        } catch (e) { }
        try {
            // get store owner's account balance
            balance = parseInt(await purchaseInstance.checkStoreOwnerBalance.call({ from: shopOwner }));            
        } catch (e) { }
        // the store owner's balance should stay the same
        assert.equal(balance, 2, "The sum was withdrawn.");
    });

    it("should withdraw", async () => {
        let balance;
        try {
            // buy product
            await purchaseInstance.withdrawFunds(1, { from: shopOwner });
        } catch (e) { }
        try {
            // get store owner's account balance
            balance = parseInt(await purchaseInstance.checkStoreOwnerBalance.call({ from: shopOwner }));            
        } catch (e) { }
        // the store owner's balance should reduce
        assert.equal(balance, 1, "The sum was not withdrawn.");
    });

})
