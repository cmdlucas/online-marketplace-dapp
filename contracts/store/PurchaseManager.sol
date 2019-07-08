pragma solidity ^0.5.0;
import { UserIdentity } from '../user/UserIdentity.sol';
import { EmitsEvent } from '../event/EmitsEvent.sol';
import { StoreManager } from './StoreManager.sol';
import { StoreExtractor } from '../_libs/StoreExtractor.sol';

/**
 * @title PurchaseManager
 * @dev Manage all store purchases here
 */
contract PurchaseManager is EmitsEvent
{
  // allow contract to be deactivated when necessary
  bool private stopped = false;

  // allow identification of user
  UserIdentity ui;
  // allow store and product access
  StoreManager sm;

  uint ourFunds;

  // map store owner address to accumulated funds
  mapping(address => uint) userFunds;

  // map store front id to funds collected
  mapping(uint => uint) storeFrontFunds;

  modifier isOwner {
    // require that the caller is a shop owner
    require(ui.fnIsOwner(msg.sender), "Only app owner can do this"); _;
  }

  modifier isShopOwner {
    // require that the caller is a shop owner
    require(ui.fnIsShopOwner(msg.sender), "Only shop owners can do this"); _;
  }
  
  // force execution to stop in emergency
  modifier stopInEmergency { if (!stopped) _; }
  
  // only allow execution in emergency
  modifier onlyInEmergency { if (stopped) _; }

  constructor(address _ui, address _sm) public 
  {
    ourFunds = 0;
    ui = UserIdentity(_ui);
    sm = StoreManager(_sm);
  }

  /**
   * @dev allow shoppers to buy a product by paying ether
   */
  function buyProduct(uint _pid, uint _qty, uint _sFID) public payable stopInEmergency
  {
    ( 
      , uint _price, uint prodQty, bool prodActive, , , address productOwner
    ) = sm.product(_pid);

    // confirm that the product is valid
    require(prodActive, "Invalid product");
    // confirm that the quantity demanded is available
    require(_qty <= prodQty, "Please review the quantity demanded");
    
    ( uint sfid, bool storeActive, , ) = sm.storeFront(_sFID);

    // confirm that the store is valid
    require(storeActive, "Invalid store front");

    // get current funds total belonging to user
    uint _soFunds = userFunds[productOwner];

    // get current funds total belonging to store
    uint _sfFunds = storeFrontFunds[sfid];

    uint price = _price * _qty;

    // prevent integer overflow
    require(_price * _qty > 0, "Bank overflow. We are no more receiving money.");
    // force buyer to pay at least the exact price
    require(price <= msg.value, "You can't pay less than the required sum");
    // prevent integer overflow
    require(_soFunds + price > 0, "Bank overflow. Store owner is no more receiving money.");
    // prevent integer overflow
    require(ourFunds + msg.value > 0, "Bank overflow. We are no more receiving money.");

    // add funds to store owner
    userFunds[productOwner] = _soFunds + price;

    // metadata: increment the total funds collected by store if within integer range
    if(_sfFunds + price > 0) {
      // add funds to store front
      storeFrontFunds[sfid] = _sfFunds + price;
    }

    // add transferred funds to our fund base so that we are taking any leftovers
    ourFunds = ourFunds + msg.value;

    // emit success event
    emitActionSuccess("Successfully paid for product");

    // update product's details
    sm.productUpdater(productOwner, _pid, _price, prodQty - _qty);
  }

  /**
   * @dev allow a store owner to retrieve funds from a store
   */
  function withdrawFunds(uint sum) public isShopOwner
  {
    // current store owner balance
    uint currBal = userFunds[msg.sender];

    // do not allow a zero sum to be withdrawn
    require(sum > 0, "Sum requested is too low");
    // confirm that store owner has sufficient balance
    require(currBal - sum >= 0, "Balance too low for this sum.");

    // prevent re-entrancy attack by setting user funds to zero;
    userFunds[msg.sender] = 0;

    // send funds to user
    msg.sender.transfer(sum);

    // set user funds to the right balance
    userFunds[msg.sender] = currBal - sum;
  }

  /**
   * @dev allow store owner check their balance
   */
  function checkStoreOwnerBalance() public view isShopOwner
        returns (uint bal)
  {
    bal = userFunds[msg.sender];
  }

  /**
   * @dev Force contract to stop on emergency
   */
  function toggleContractActive() public isOwner {
    // toggle contract active state
    stopped = !stopped;
  }

}
