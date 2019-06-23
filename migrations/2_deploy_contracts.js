var UserProfileManager = artifacts.require("UserProfileManager");

module.exports = function(deployer) {
  deployer.deploy(UserProfileManager);
};
