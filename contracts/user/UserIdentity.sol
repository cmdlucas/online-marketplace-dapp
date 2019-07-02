pragma solidity ^0.5.0;
import { Owned } from './Owned.sol';

/** 
 * @title UserIdentity
 * @dev This contract defines who a user is,
 * It also provides permissions through its modifiers
 */
contract UserIdentity is Owned {
  // Arrays to hold all user types;
  address[] public admins;
  address[] public shop_owners;

  // Let's have a way to easily check for a user type
  // mainly because of gas costs when we loop
  mapping(address => bool) public admin;
  mapping(address => bool) public shop_owner;

  modifier isAdmin (address _sender) {
    // require that the caller is an admin
    require(admin[_sender], "Only admins can do this"); _;
  }

  modifier isShopOwner (address _sender) {
    // require that the caller is a shop owner
    require(shop_owner[_sender], "Only shop owners can do this"); _;
  }

  modifier isAdminOrShopOwner {
      // require that the caller is an admin or the shop owner
    require(admin[msg.sender] || shop_owner[msg.sender],
    "You must be an admin or shop owner to do this"); _;
  }

  constructor() public 
  {
    // set contract deployer as admin
    admin[msg.sender] = true;
    admins.push(msg.sender);
  }

  /**
   * @dev help other contracts determine if caller is dApp owner
   */
  function fnIsOwner(address sender) public view returns (bool) 
  {
    return sender == owner;
  }

  /**
   * @dev help other contracts determine if caller is an admin
   */
  function fnIsAdmin(address _sender) public view returns (bool) {
    return admin[_sender];
  }

  /**
   * @dev help other contracts determine if caller is a shop owner
   */
  function fnIsShopOwner(address _sender) public view returns (bool) 
  {
    return shop_owner[_sender];
  }

  /**
   * @dev help other contracts determine if caller is a shop owner
   */
  function fnIsAdminOrShopOwner(address _sender) public view returns (bool) 
  {
    return admin[_sender] || shop_owner[_sender];
  }

  /**
   * @dev set admin address
   */
  function setAdminAddress(address _sender, address _admin) public
  {
    require(owner == _sender, ownerFailureStatement);
    admin[_admin] = true;
    admins.push(_admin);
  }

  /**
   * @dev set shop owner address
   */
  function setShopOwnerAddress(address _sender ,address _shop_owner) public isAdmin(_sender)
  {
    shop_owner[_shop_owner] = true;
    shop_owners.push(_shop_owner);
  }

  /**
   * @dev activate/deactivate admin
   */
  function adminActivator(address _sender, address _admin, bool state) public
  {
    require(owner == _sender, ownerFailureStatement);
    admin[_admin] = state;
  }

  /**
   * @dev activate/deactivate shop owner
   */
  function shopOwnerActivator(address _sender, address _admin, bool state) public isAdmin(_sender)
  {
    shop_owner[_admin] = state;
  }

  /**
   * @dev Get admins
   */
  function getAdmins(address _sender) public view returns (address[] memory)
  {
    require(owner == _sender, ownerFailureStatement);
    return admins;
  }

  /**
   * @dev Get shop owners
   */
  function getShopOwners(address _sender) public view isAdmin(_sender) returns (address[] memory) 
  {
    return shop_owners;
  }
   
}
