pragma solidity ^0.5.0;

/**
 * @title UserIdentity
 * @dev This library has functions to extract elements 
 */
library StoreExtractor {

  // StoreFront structure
  struct StoreFront {
    uint id;
    bool active;
    string name;
    address storeOwner;
  }

  // Product structure
  struct Product {
    uint id;
    uint price;
    uint qty;
    bool active;
    string name;
    string imageId;
    address productOwner;
  }

  /**
   * @dev extract store fronts from a list of store front IDs
   * @return sFID[], name[], prodQty[]
   */
  function extractStoreFronts(uint[] storage sFIDs, 
        mapping(uint => StoreFront) storage storeFronts, 
        mapping(uint => uint[]) storage storeFrontProducts) internal view
        returns (uint[] memory, uint[] memory, bool[] memory, bytes32[] memory)
  {
    // extract all store front props;
    uint[] memory productsQtys = new uint[] (sFIDs.length);
    bool[] memory active = new bool[] (sFIDs.length);
    bytes32[] memory names = new bytes32[] (sFIDs.length);
    
    //Get store fronts data
    for(uint i = 0; i < sFIDs.length; i++) 
    {
      StoreFront memory storeFront = storeFronts[sFIDs[i]];

      // Get store front's name
      string memory sfName = storeFront.name;
      bytes32 _name;
      // convert to bytes32
      assembly {
        _name := mload(add(sfName, 32))
      }
      names[i] = _name;
      active[i] = storeFront.active;
      productsQtys[i] = storeFrontProducts[sFIDs[i]].length;
    }

    return (sFIDs, productsQtys, active, names);
  }

  /**
   * @dev extract products from a list of store front IDs
   * @return sFID[], name[], prodQty[]
   */
  function extractProducts(uint[] storage prods, 
        mapping (uint => Product) storage prodDetails) internal view
        returns (uint[] memory, uint[] memory, uint[] memory, bool[] memory, 
        bytes32[] memory, bytes32[] memory)
  {
    uint[] memory id = new uint[] (prods.length);
    uint[] memory price = new uint[] (prods.length);
    uint[] memory qty = new uint[] (prods.length);
    bool[] memory active = new bool[] (prods.length);
    bytes32[] memory name = new bytes32[](prods.length);
    bytes32[] memory imageId = new bytes32[](prods.length);

    //Go through the products id and map props into array of 
    for(uint i = 0; i < prods.length; i++)
    {
      uint pid = prods[i];
      Product memory prod = prodDetails[pid];
      id[i] = prod.id;
      price[i] = prod.price;
      qty[i] = prod.qty;
      active[i] = prod.active;
      string memory prodName = prod.name; 
      string memory prodImageId = prod.imageId;
      bytes32 _name; bytes32 _imageId;
      //convert string to bytes32
      assembly {
        _name := mload(add(prodName, 32))
        _imageId := mload(add(prodImageId, 32))
      }
      name[i] = _name;
      imageId[i] = _imageId;      
    }
    //return tuple of props
    return (id, price, qty, active, name, imageId);
  }
}