pragma solidity ^0.5.0;
import { UserIdentity } from './UserIdentity.sol';
import '../event/EmitsEvent.sol';

/** 
 * @title UserProfileManager
 * @dev This contract provides us a way to store users profile
 * and update them based on the permissions declared.
 * 1. dApp Owner (who is also an admin) can create and update admin and shop owner profile
 * 2. dApp Admin can create shop owner profile
 * 3. dApp Admin can update both self and shop owner profile
 * 4. dApp shopOwner can only update their own profile
 * 
 * todo:: manage the total number of users we can create to avoid a DoS exploitation where 
 * so many accounts get created and the loops to fetch makes us always run out of gas.
 */
contract UserProfileManager is EmitsEvent {
  // allow identification of user
  UserIdentity ui;

  enum UserType { Owner, Admin, ShopOwner }

  struct Profile {
    address addr;
    bool active;
    string firstName;
    string lastName;
    UserType userType;
  }

  mapping(address => Profile) profile;

  modifier isOwner {
      // require that the caller is the dApp owner
      require(ui.fnIsOwner(msg.sender), "Only the dApp owner can perform this action."); _;
  }

  modifier isAdmin {
    // require that the caller is an admin
    require(ui.fnIsAdmin(msg.sender), "Only admins can do this"); _;
  }

  modifier isShopOwner {
    // require that the caller is a shop owner
    require(ui.fnIsShopOwner(msg.sender), "Only shop owners can do this"); _;
  }

  modifier isAdminOrShopOwner {
    // require that the caller is an admin or the shop owner
    require(ui.fnIsAdminOrShopOwner(msg.sender), "You must be an admin or shop owner to do this"); _;
  }

  modifier ownsAdminProfile(address user) {
    // require that the profile is owned by the admin; proceed if app owner is the caller
    require((msg.sender == profile[user].addr || ui.fnIsOwner(msg.sender)),
            "You don't own this profile and cannot update it."); _;
  }

  modifier ownsShopOwnerProfile(address user) {
    // require that the profile is owned by shop owner; proceed if admin is the caller
    require(msg.sender == profile[user].addr || ui.fnIsAdmin(msg.sender),
            "You don't own this profile and cannot update it."); _;
  }

  constructor(address _ui) public {
    // explicit conversion to allow the identification of users
    ui = UserIdentity(_ui);
    // set my profile as the owner
    profile[msg.sender] = Profile(msg.sender, true, "Caleb", "Lucas", UserType.Owner);
  }

  /**
   * @dev Set new user profile based on user type
   * - Overwrites profile if address previously existed
   * @param uType can be any of 0, 1 or 2
   */
  function addNewProfile(address user, uint8 uType,
                string memory firstName, string memory lastName) public
  {
    // set address so that modififer can be aware
    // to grant specific access to user in the future
    if (uType == uint8(UserType.Admin)) {
      ui.setAdminAddress(msg.sender, user);
    }
    else if (uType == uint8(UserType.ShopOwner)) {
      ui.setShopOwnerAddress(msg.sender, user);
    }
    // now add profile
    addProfile(user, uType, firstName, lastName);
  }

  /**
   * @dev Set user profile based on user type
   * - Overwrites profile if address previously existed
   * @param user - do not assume msg.sender as the user profile we're adding: this function is versatile
   * @param uType can be any of 0, 1 or 2
   */
  function addProfile(address user, uint8 uType,
                string memory firstName, string memory lastName) public
  {
    // set admin profile
    if (uType == uint8(UserType.Admin)) {
      addAdminProfile(user, firstName, lastName);
    }
    // set shop owner profile
    else if (uType == uint8(UserType.ShopOwner)) {
      addShopOwnerProfile(user, firstName, lastName);
    }
    // emit success event
    emitActionSuccess("Profile added succesfully");
  }

  /**
   * @dev Create admin profile
   */
  function addAdminProfile(address user, string memory firstName,
                            string memory lastName) private isOwner
  {
    // set profile
    profile[user] = Profile(user, true, firstName, lastName, UserType.Admin);
  }

  /**
   * @dev Create shop owner profile
   */
  function addShopOwnerProfile(address user, string memory firstName,
                            string memory lastName) private isAdmin
  {
    // set profile
    profile[user] = Profile(user, true, firstName, lastName, UserType.ShopOwner);
    // emit success event
    emitActionSuccess("Shop owner profile created succesfully");
  }

  /**
   * @dev Update user profile based on user type
   * @param user - do not rely on msg.sender because of function versatility
   * @param uType can be any of 0, 1 or 2
   */
  function updateProfile(address user, uint8 uType,
                string memory firstName, string memory lastName) public
  {
    // set owner profile
    if(uType == uint8(UserType.Owner)) {
      setOwnerProfile(user, firstName, lastName);
    }
    // set admin profile
    else if (uType == uint8(UserType.Admin)) {
      setAdminProfile(user, firstName, lastName);
    }
    // set shop owner profile
    else if (uType == uint8(UserType.ShopOwner)) {
      setShopOwnerProfile(user, firstName, lastName);
    }
  }

  /**
   * @dev Create owner profile
   */
  function setOwnerProfile(address user, string memory firstName,
                            string memory lastName) private isOwner
  {
    // set profile
    profile[user] = Profile(user, true, firstName, lastName, UserType.Owner);
    // emit success event
    emitActionSuccess("Owner profile created successfully");
  }

  /**
   * @dev Set admin profile
   */
  function setAdminProfile(address user, string memory firstName,
                            string memory lastName) private ownsAdminProfile(user)
  {
    // set profile
    profile[user] = Profile(user, true, firstName, lastName, UserType.Admin);
    // emit success event
    emitActionSuccess("Admin profile updated succesfully");
  }

  /**
   * @dev Set shop owner profile
   */
  function setShopOwnerProfile(address user, string memory firstName,
                            string memory lastName) private ownsShopOwnerProfile(user)
  {
    // set profile
    profile[user] = Profile(user, true, firstName, lastName, UserType.ShopOwner);
    // emit success event
    emitActionSuccess("Shop owner profile updated succesfully");
  }

  /**
   * @dev Activate admin account
   */
  function activateAdmin(address user) public isOwner
  {
    // activate profile
    profile[user].active = true;
    // update restriction access controller
    ui.adminActivator(msg.sender, user, true);
  }

  /**
   * @dev Deactivate admin account
   */
  function deActivateAdmin(address user) public isOwner
  {
    // deactivate profile
    profile[user].active = false;
    // update restriction access controller
    ui.adminActivator(msg.sender, user, false);
  }

  /**
   * @dev Activate shop owner account
   */
  function activateShopOwner(address user) public isAdmin
  {
    // activate profile
    profile[user].active = true;
    // update restriction access controller
    ui.shopOwnerActivator(msg.sender, user, true);
  }
  
  /**
   * @dev Deactivate shop owner account
   */
  function deActivateShopOwner(address user) public isAdmin
  {
    // deactivate profile
    profile[user].active = false;
    // update restriction access controller
    ui.shopOwnerActivator(msg.sender, user, false);
  }

  /**
   * @dev Get user profile
   */
  function getUserProfile(address user) public view returns(address addr, bool active,
          string memory firstName, string memory lastName, UserType userType)
  {
    Profile memory p = profile[user];
    return (p.addr, p.active, p.firstName, p.lastName, p.userType);
  }

  /**
   * @dev Get all admins profiles
   */
  function getAdminsProfiles() public view isOwner returns(address[] memory, bool[] memory, 
          bytes32[] memory, bytes32[] memory, uint8[] memory)
  {
    return getUsers(ui.getAdmins(msg.sender));
  }

  /**
   * @dev Get all shopowners profiles
   */
  function getShopOwnersProfiles() public view isAdmin returns(address[] memory, bool[] memory,
          bytes32[] memory, bytes32[] memory, uint8[] memory)
  {
    return getUsers(ui.getShopOwners(msg.sender));
  }

  /**
   * @dev Extract all users profiles
   * todo:: see todo at contract's head
   */
  function getUsers (address[] memory users) private view returns(address[] memory, bool[] memory,
          bytes32[] memory, bytes32[] memory, uint8[] memory)
  {
    address[] memory addrs = new address[] (users.length);
    bool[] memory actives = new bool[] (users.length);
    bytes32[] memory firstNames = new bytes32[] (users.length);
    bytes32[] memory lastNames = new bytes32[] (users.length);
    uint8[] memory userTypes = new uint8[] (users.length);
    //Get users profile data
    for(uint i = 0; i < users.length; i++) {
      // get profile of this user
      Profile memory p = profile[users[i]];
      addrs[i] = p.addr;
      actives[i] = p.active;
      string memory fiName = p.firstName;
      string memory laName = p.lastName;
      bytes32 fName; bytes32 lName;
      // convert string to bytes32
      assembly {
        fName := mload(add(fiName, 32))
        lName := mload(add(laName, 32))
      }
      // store strings
      firstNames[i] = fName;
      lastNames[i] = lName;
      userTypes[i] = uint8(p.userType);
    }
    return (addrs, actives, firstNames, lastNames, userTypes);
  }
}
