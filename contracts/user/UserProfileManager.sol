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
    string firstName;
    string lastName;
    UserType userType;
  }

  mapping(address => Profile) internal profile;

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
    profile[msg.sender] = Profile(msg.sender, "Caleb", "Lucas", UserType.Owner);
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
    profile[user] = Profile(user, firstName, lastName, UserType.Owner);
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
    profile[user] = Profile(user, firstName, lastName, UserType.Admin);
  }

  /**
   * @dev Create shop owner profile
   */
  function addShopOwnerProfile(address user, string memory firstName,
                            string memory lastName) private isAdmin
  {
    // set profile
    profile[user] = Profile(user, firstName, lastName, UserType.ShopOwner);
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
    profile[user] = Profile(user, firstName, lastName, UserType.Admin);
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
    profile[user] = Profile(user, firstName, lastName, UserType.ShopOwner);
    // emit success event
    emitActionSuccess("Shop owner profile updated succesfully");
  }

  /**
   * @dev Get user profile
   */
  function getUserProfile(address user) public view returns(address addr,
          string memory firstName, string memory lastName, UserType userType)
  {
    Profile memory p = profile[user];
    return (p.addr, p.firstName, p.lastName, p.userType);
  }

}
