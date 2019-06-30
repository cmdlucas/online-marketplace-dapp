pragma solidity ^0.5.0;
import { UserIdentity } from './UserIdentity.sol';
import '../event/EmitsEvent.sol';

// This contract provides us a way to store users profile
// and update them based on the permissions declared.
// 1. dApp Owner (who is also an admin) can create and update admin and shop owner profile
// 2. dApp Admin can create shop owner profile
// 3. dApp Admin can update both self and shop owner profile
// 4. dApp shopOwner can only update their own profile

contract UserProfileManager is UserIdentity, EmitsEvent {

  enum UserType { Owner, Admin, ShopOwner }

  struct Profile {
    address addr;
    bool active;
    string firstName;
    string lastName;
    UserType userType;
  }

  mapping(address => Profile) profile;

  modifier ownsAdminProfile(address user) {
    // require that the profile is owned by either the admin or app owner is the caller
    require((msg.sender == profile[user].addr || msg.sender == owner),
            "You don't own this profile and cannot update it."); _;
  }

  modifier ownsShopOwnerProfile(address user) {
    // require that the profile is owned by either shop owner or admin is the caller
    require(msg.sender == profile[user].addr || admin[msg.sender],
            "You don't own this profile and cannot update it."); _;
  }

  constructor() public {
    // set my profile as the owner
    profile[msg.sender] = Profile(msg.sender, true, "Caleb", "Lucas", UserType.Owner);
  }

  /**
   * @dev Set new user profile based on user type
   * @param uType can be any of 0, 1 or 2
   */
  function addNewProfile(address user, uint8 uType,
                string memory firstName, string memory lastName) public
  {
    // set address so that modififer can be aware
    if (uType == uint8(UserType.Admin)) {
      setAdminAddress(user);
    }
    else if (uType == uint8(UserType.ShopOwner)) {
      setShopOwnerAddress(user);
    }

    // now add profile
    addProfile(user, uType, firstName, lastName);
  }

  /**
   * @dev Set user profile based on user type
   * @param user - do not rely on msg.sender because of function versatility
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
    // emit success event
    emitActionSuccess("Profile added succesfully");
    }
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

  function activateAdmin(address user) public isOwner
  {
    profile[user].active = true;
  }

  function deActivateAdmin(address user) public isOwner
  {
    profile[user].active = false;
  }

  function activateShopOwner(address user) public isAdmin
  {
    profile[user].active = true;
  }

  function deActivateShopOwner(address user) public isAdmin
  {
    profile[user].active = false;
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
   * @dev Get all users profiles
   */
  function getUsers (address[] memory users) private view returns(address[] memory, bool[] memory,
          bytes32[] memory, bytes32[] memory, uint8[] memory)
  {
    address[] memory addrs = new address[] (users.length);
    bool[] memory actives = new bool[] (users.length);
    bytes32[] memory firstNames = new bytes32[] (users.length);
    bytes32[] memory lastNames = new bytes32[] (users.length);
    uint8[] memory userTypes = new uint8[] (users.length);
    for(uint i = 0; i < users.length; i++) {
      // get profile of this particular admin
      Profile memory p = profile[users[i]];
      addrs[i] = p.addr;
      actives[i] = p.active;
      string memory fiName = p.firstName;
      string memory laName = p.lastName;
      bytes32 fName;
      bytes32 lName;
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

  /**
   * @dev Get all admins profiles
   */
  function getAdminsProfiles() public view returns(address[] memory, bool[] memory, 
          bytes32[] memory, bytes32[] memory, uint8[] memory)
  {
    return getUsers(admins);
  }

  /**
   * @dev Get all shopowners profiles
   */
  function getShopOwnersProfiles() public view returns(address[] memory, bool[] memory,
          bytes32[] memory, bytes32[] memory, uint8[] memory)
  {
    return getUsers(shop_owners);
  }

}
