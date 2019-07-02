var UserIdentity = artifacts.require("UserIdentity");
var UserProfileManager = artifacts.require("UserProfileManager");
var StoreManager = artifacts.require("StoreManager");

module.exports = function(deployer) {
  return (
    async function () {
      await deployer.deploy(UserIdentity);
      await deployer.deploy(UserProfileManager, UserIdentity.address);
      await deployer.deploy(StoreManager, UserIdentity.address);
    }
  )();
};
