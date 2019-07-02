var UserIdentity = artifacts.require("UserIdentity");
var UserProfileManager = artifacts.require("UserProfileManager");
var StoreManager = artifacts.require("StoreManager");

module.exports = function(deployer) {
  deployer.deploy(UserProfileManager);
  deployer.deploy(StoreManager);
};
