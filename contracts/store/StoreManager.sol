pragma solidity ^0.5.0;
import { UserIdentity } from '../user/UserIdentity.sol';
import { EmitsEvent } from '../event/EmitsEvent.sol';
import { StoreExtractor } from '../_libs/StoreExtractor.sol';

/**
 * @title StoreManager
 * @dev Manage store activities here
 */
contract StoreManager is EmitsEvent 
{
  // allow contract to be deactivated when necessary
  bool private stopped = false;
  
  // allow identification of user
  UserIdentity ui;

  // allow extractor to work on arrays of ids
  using StoreExtractor for uint[];
  
  // track product count
  uint public prodCount;

  // keep track of all the store front by their IDs
  uint[] public sFIDs;

  // map each storefront to it's content
  mapping(uint => StoreExtractor.StoreFront) public storeFront;

  // map each product id to it's content
  mapping(uint => StoreExtractor.Product) public product;

  // map store front to it's products (id)
  mapping(uint => uint[]) public storeFrontProducts;

  // map store front to active products count
  mapping(uint => uint) public storeFrontProductsActive;

  // map store owner to their store fronts 
  mapping(address => uint[]) public oMap;

  modifier isOwner {
    // require that the caller is a shop owner
    require(ui.fnIsOwner(msg.sender), "Only app owner can do this"); _;
  }

  modifier isShopOwner {
    // require that the caller is a shop owner
    require(ui.fnIsShopOwner(msg.sender), "Only shop owners can do this"); _;
  }

  // restrict access to product
  modifier ownsProduct(address _sender, uint _prodId) {
    require(product[_prodId].productOwner == msg.sender || product[_prodId].productOwner == _sender, 
        "Only the product's owner can do this"); _;
  }
  
  // restrict access to owner of the store
  modifier ownsStore(uint _sFID) {
    require(storeFront[_sFID].storeOwner == msg.sender, 
        "Only the store owner can do this"); _;
  }
  
  // force execution to stop in emergency
  modifier stopInEmergency { if (!stopped) _; }
  
  // only allow execution in emergency
  modifier onlyInEmergency { if (stopped) _; }

  constructor(UserIdentity _ui) public {
    // allow the identification of users
    ui = UserIdentity(_ui);
  }

  /**
   * @dev Create a new store front
   */
  function createStoreFront(string memory name) public isShopOwner stopInEmergency returns (uint newIndex)
  {
    // create unique ID to use
    newIndex = sFIDs.length;
    // add new store front
    storeFront[newIndex] = StoreExtractor.StoreFront(newIndex, true, name, msg.sender);
    // add store front to owner's list
    oMap[msg.sender].push(newIndex);
    // track all sFIDs
    sFIDs.push(newIndex);
    // emit success event
    emitActionSuccess("Store front created successfully.");
  }

  /**
   * @dev Add a new product to a store front
   */
  function addProduct(uint _sFID, uint _price, uint _qty, 
          string memory _name, string memory _imageId) public stopInEmergency ownsStore(_sFID)
          returns (uint newIndex)
  {
    require(_price > 0, "Price must be more than zero");
    // create unique ID to use
    newIndex = prodCount;
    // register product's details
    product[newIndex] = StoreExtractor.Product(newIndex, _price, _qty, true, _name, _imageId, msg.sender);
    // add product to store front's list of products
    storeFrontProducts[_sFID].push(newIndex);
    storeFrontProductsActive[_sFID] = storeFrontProducts[_sFID].length;
    // emit success event
    emitActionSuccess("Product created successfully.");
    // increment product count
    prodCount = prodCount + 1;
  }

   /**
    * @dev Update a product's details.
    * @param _sender - allows versatility with function
    */
   function productUpdater(address _sender, uint _prodId, uint _price, uint _qty) public 
        stopInEmergency ownsProduct(_sender, _prodId)
   {
     product[_prodId].price = _price;
     product[_prodId].qty = _qty;
   }

   /**
    * @dev Mark a product as (de)activated.
    */
   function productActivator(uint _sfid, uint _prodId, bool status) public 
        stopInEmergency ownsProduct(msg.sender, _prodId) 
   {
     // update product status
     product[_prodId].active = status;
     // update store products' count
    storeFrontProductsActive[_sfid] = status 
          ? (
              storeFrontProductsActive[_sfid] < storeFrontProducts[_sfid].length 
              ? storeFrontProductsActive[_sfid] + 1  
              : storeFrontProducts[_sfid].length
            )
          : storeFrontProductsActive[_sfid] - 1;
   }

   /**
    * @dev Mark a store front as (de)activated.
    */
   function storeFrontActivator(uint _sFID, bool status) public ownsStore(_sFID)
   {
     storeFront[_sFID].active = status;
   }

  /**
   * @dev Get store fronts for a shop owner
   * @return sFID[], name[], prodQty[]
   */
  function getStoreFronts(address _storeOwner, uint from, uint to) public view 
        returns (uint[] memory, uint[] memory, bool[] memory, bytes32[] memory)
  {
    // cover a specific range per request
    require(from >= 0 && to >= 0 && to - from <= 25, "Invalid range supplied.");
    // return store owner's store fronts data using extractor library
    return oMap[_storeOwner].extractStoreFronts(from, to, storeFront, storeFrontProductsActive);
  }

  /**
   * @dev Get some store fronts by range
   * @return sFID[], name[], prodQty[]
   */
  function getSomeStoreFronts(uint from, uint to) public view 
        returns (uint[] memory, uint[] memory, bool[] memory, bytes32[] memory)
  {
    // cover range
    require(from >= 0 && to >= 0 && to - from <= 25, "Invalid range supplied.");
    // return store fronts data using extractor library
    return sFIDs.extractStoreFronts(from, to, storeFront, storeFrontProductsActive);
  }

  /**
   * @dev Get all store fronts
   * @return sFID[], name[], prodQty[]
   * todo:: remove this function in future to prevent DoS attack
   */
  function getAllStoreFronts() internal view 
        returns (uint[] memory, uint[] memory, bool[] memory, bytes32[] memory)
  {
    // return store fronts data using extractor library
    return sFIDs.extractStoreFronts(0, sFIDs.length, storeFront, storeFrontProductsActive);    
  }

  /**
   * @dev Get store front details
   * @return (string, bool, uint)
   */
  function getStoreFrontDetails(uint _sFID) public view
         returns (string memory name, bool active, uint prodQty)
  {
    name = storeFront[_sFID].name;
    active = storeFront[_sFID].active;
    prodQty = storeFrontProductsActive[_sFID];
    return (name, active, prodQty);
  }

  /**
   * @dev Get the products in a store front
   */
  function getStoreFrontProducts(uint _sFID, uint from, uint to) public view
        returns (uint[] memory, uint[] memory, uint[] memory, 
        bool[] memory, bytes32[] memory)
  {
    // cover range
    require(from >= 0 && to >= 0 && to - from <= 25, "Invalid range supplied.");
    // return a tuple of arrays of product props
    return storeFrontProducts[_sFID].extractProducts(from, to, product);
  }

  /**
   * @dev Get store front details
   */
  function getProductDetails(uint _prodId) public view
         returns (uint price, uint qty, bool active, string memory name, string memory imageId)
  {
    price = product[_prodId].price;
    qty = product[_prodId].qty;
    active = product[_prodId].active;
    name = product[_prodId].name;
    imageId = product[_prodId].imageId;
    return (price, qty, active, name, imageId);
  }

  /**
   * @dev Force contract to stop on emergency
   */
  function toggleContractActive() public isOwner {
    // toggle contract active state
    stopped = !stopped;
  }
  
}
