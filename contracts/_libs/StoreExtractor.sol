pragma solidity ^0.5.0;

/**
 * @title UserIdentity
 * @dev This library has functions to extract elements 
 */
library StoreExtractor {

  // StoreFront structure
  struct StoreFront {
    uint id;
    string name;
    address storeOwner;
  }

  // Product structure
  struct Product {
    uint id;
    uint price;
    uint qty;
    string name;
    string imageId;
  }

  /**
   * @dev extract store fronts from a list of store front IDs
   */
  function extractStoreFronts(uint[] storage sFIDs, 
        mapping(uint => StoreFront) storage storeFronts, 
        mapping(uint => uint[]) storage storeFrontProducts) internal view
        returns (bytes32[] memory, uint[] memory)
  {
    // extract all store front props;
    bytes32[] memory names = new bytes32[] (sFIDs.length);
    uint[] memory productsQtys = new uint[] (sFIDs.length);
    
    //Get store fronts data
    for(uint i = 0; i < sFIDs.length; i++) 
    {
      // Get store front's name
      string memory sfName = storeFronts[sFIDs[i]].name;
      bytes32 _name;
      // convert to bytes32
      assembly {
        _name := mload(add(sfName, 32))
      }
      names[i] = _name;
      productsQtys[i] = storeFrontProducts[sFIDs[i]].length;
    }

    return (names, productsQtys);
  }

  function extractProducts(uint[] storage prods, 
        mapping (uint => Product) storage prodDetails) internal view
        returns (uint[] memory, uint[] memory, uint[] memory, bytes32[] memory, bytes32[] memory)
  {
    uint[] memory id = new uint[] (prods.length);
    uint[] memory price = new uint[] (prods.length);
    uint[] memory qty = new uint[] (prods.length);
    bytes32[] memory name = new bytes32[](prods.length);
    bytes32[] memory imageId = new bytes32[](prods.length);

    //Go through the products id and map props into array of 
    for(uint i = 0; i < prods.length; i++)
    {
      uint pid = prods[i];
      id[i] = prodDetails[pid].id;
      price[i] = prodDetails[pid].price;
      qty[i] = prodDetails[pid].qty;
      string memory prodName = prodDetails[pid].name;
      string memory prodImageId = prodDetails[pid].imageId;
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
    return (id, price, qty, name, imageId);
  }
}