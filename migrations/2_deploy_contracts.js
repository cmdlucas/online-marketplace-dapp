var UserIdentity = artifacts.require("UserIdentity");
var UserProfileManager = artifacts.require("UserProfileManager");
var StoreManager = artifacts.require("StoreManager");
var PurchaseManager = artifacts.require("PurchaseManager");

module.exports = function(deployer) {
  return (
    async function () {
      await deployer.deploy(UserIdentity);
      await deployer.deploy(UserProfileManager, UserIdentity.address);
      await deployer.deploy(StoreManager, UserIdentity.address);
      await deployer.deploy(PurchaseManager, UserIdentity.address, StoreManager.address);
    }
  )();
};
