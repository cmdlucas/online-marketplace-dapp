pragma solidity ^0.5.0;
import { UserIdentity } from '../user/UserIdentity.sol';
import { EmitsEvent } from '../event/EmitsEvent.sol';
import { StoreExtractor } from '../_libs/StoreExtractor.sol';

/**
 * @title StoreManager
 * @dev Manage store activities here
 * todo:: determine the maximum limit to fetch to prevent a DoS attack
 */
contract StoreManager is EmitsEvent {
  // allow identification of user
  UserIdentity ui;
  // allow extractor to work on arrays of ids
  using StoreExtractor for uint[];
  
  // track product count
  uint public prodCount;

  // keep track of all the store front by their IDs
  uint[] public sFIDs;

  // map each storefront to it's content
  mapping(uint => StoreExtractor.StoreFront) storeFront;

  // map each product id to it's content
  mapping(uint => StoreExtractor.Product) product;

  // map store front to it's products (id)
  mapping(uint => uint[]) storeFrontProducts;

  // map store owner to their store fronts 
  mapping(address => uint[]) oMap;

  modifier isShopOwner {
    // require that the caller is a shop owner
    require(ui.fnIsShopOwner(msg.sender), "Only shop owners can do this"); _;
  }
  
  // restrict access to owner of the store
  modifier ownsStore(uint _sFID) {
    require(storeFront[_sFID].storeOwner == msg.sender, 
        "Only the store owner can do this"); _;
  }

  constructor(UserIdentity _ui) public {
    // allow the identification of users
    ui = UserIdentity(_ui);
  }

  /**
   * @dev Create a new store front
   */
  function createStoreFront(string memory name) public isShopOwner returns (uint newIndex)
  {
    // create unique ID to use
    newIndex = sFIDs.length;
    // todo:: ensure that we are within range of allowed store fronts
    // add new store front
    storeFront[newIndex] = StoreExtractor.StoreFront(newIndex, name, msg.sender);
    // add store front to owner's list
    oMap[msg.sender].push(newIndex);
    // emit success event
    emitActionSuccess("Store front created successfully.");
    // return the store front index
    return newIndex;
  }

  /**
   * @dev Add a new product to a store front
   */
  function addProduct(uint _sFID, uint _price, uint _qty, 
          string memory _name, string memory _imageId) public ownsStore(_sFID) 
          returns (uint newIndex)
  {
    // create unique ID to use
    newIndex = prodCount;
    // register product's details
    product[newIndex] = StoreExtractor.Product(newIndex, _price, _qty, _name, _imageId);
    // add product to store front's list of products
    storeFrontProducts[_sFID].push(newIndex);
    // emit success event
    emitActionSuccess("Product created successfully.");
    // increment product count
    prodCount++;
    // return the store front index
    return newIndex;
  }

  /**
   * @dev Get store fronts for a shop owner
   * todo:: see todo at contract's head
   * @return sFID[], name[], prodQty[]
   */
  function getStoreFronts(address _storeOwner) public view 
        returns (uint[] memory, bytes32[] memory, uint[] memory)
  {
    // return store owner's store fronts data using extractor library
    return oMap[_storeOwner].extractStoreFronts(storeFront, storeFrontProducts); 
  }

  /**
   * @dev Get all store fronts
   * @return sFID[], name[], prodQty[]
   */
  function getAllStoreFronts() public view 
        returns (uint[] memory, bytes32[] memory, uint[] memory)
  {
    // return store fronts data using extractor library
    return sFIDs.extractStoreFronts(storeFront, storeFrontProducts);    
  }

  /**
   * @dev Get store front details
   * @return sFID[], name[], prodQty[]
   */
   function getStoreFrontDetails(uint _sFID) public view
         returns (string memory name, uint prodQty)
   {
     name = storeFront[_sFID].name;
     prodQty = storeFrontProducts[_sFID].length;
     return (name, prodQty);
   }

  /**
   * @dev Get the products in a store front
   */
  function getStoreFrontProducts(uint _sFID) public view
        returns (uint[] memory, uint[] memory, uint[] memory, bytes32[] memory, bytes32[] memory)
  {
    // return a tuple of arrays of product props
    return storeFrontProducts[_sFID].extractProducts(product);
  }

  /**
   * @dev Get store front details
   */
   function getProductDetails(uint _prodId) public view
         returns (uint price, uint qty, string memory name, string memory imageId)
   {
     price = product[_prodId].price;
     qty = product[_prodId].qty;
     name = product[_prodId].name;
     imageId = product[_prodId].imageId;
     return (price, qty, name, imageId);
   }
  
}
