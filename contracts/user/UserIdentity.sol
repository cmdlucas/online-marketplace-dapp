pragma solidity ^0.5.0;
import { Owned } from './Owned.sol';

// This contract defines who a user is
// It also provides permissions through its modifiers
contract UserIdentity is Owned {

  mapping(address => bool) admin;
  mapping(address => bool) shop_owner;

  modifier isAdmin {
    require(admin[msg.sender], "Only admins can do this"); _;
  }

  modifier isShopOwner {
    require(shop_owner[msg.sender], "Only shop owners can do this"); _;
  }

  modifier isAdminOrShopOwner {
    require(admin[msg.sender] || shop_owner[msg.sender],
    "You must be an admin or shop owner to do this"); _;
  }

  constructor() public {
    // set contract deployer as admin
    admin[msg.sender] = true;
  }

  function setAdminAddress(address _admin) internal isOwner
  {
    admin[_admin] = true;
  }

  function setShopOwnerAddress(address _shop_owner) internal isAdmin
  {
    shop_owner[_shop_owner] = true;
  }

}
