const UserIdentity = artifacts.require("UserIdentity");

contract('UserIdentity', async accounts => {
    let instance;
    const UserType = { Owner: 0, Admin: 1, ShopOwner: 2 }
    const [owner, admin, adminTwo, shopOwner, shopOwnerTwo] = accounts;

    before(async () => {
        instance = await UserIdentity.deployed();
    });

})