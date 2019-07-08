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
        uint from, uint to,
        mapping(uint => StoreFront) storage storeFronts, 
        mapping(uint => uint) storage storeFrontProductsActive) internal view
        returns (uint[] memory, uint[] memory, bool[] memory, bytes32[] memory)
  {
    uint dest = to >= sFIDs.length ? sFIDs.length : to;
    uint diff = to - from;
    
    // extract all store front props;
    uint[] memory productsQtys = new uint[] (diff);
    bool[] memory active = new bool[] (diff);
    bytes32[] memory names = new bytes32[] (diff);
    
    //Get store fronts data
    for(uint i = from; i < dest; i++) 
    {
      uint sfid = sFIDs[i];
      StoreFront memory storeFront = storeFronts[sfid];

      // Get store front's name
      string memory sfName = storeFront.name;
      bytes32 _name;
      // convert to bytes32
      assembly {
        _name := mload(add(sfName, 32))
      }
      names[i] = _name;
      active[i] = storeFront.active;
      productsQtys[i] = storeFrontProductsActive[sfid];
    }

    return (sFIDs, productsQtys, active, names);
  }

  /**
   * @dev extract products from a list of store front IDs
   * @return sFID[], name[], prodQty[]
   */
  function extractProducts(uint[] storage prods,
        uint from, uint to,
        mapping (uint => Product) storage prodDetails) internal view
        returns (uint[] memory id, uint[] memory price, uint[] memory qty, 
        bool[] memory active, bytes32[] memory name)
  {
    uint dest = to >= prods.length ? prods.length : to;
    uint diff = to - from;

    id = new uint[] (diff);
    price = new uint[] (diff);
    qty = new uint[] (diff);
    active = new bool[] (diff);
    name = new bytes32[](diff);

    //Go through the products id and map props into array of 
    for(uint i = from; i < dest; i++)
    {
      uint pid = prods[i];
      Product memory prod = prodDetails[pid];
      id[i] = prod.id;
      price[i] = prod.price;
      qty[i] = prod.qty;
      active[i] = prod.active;
      string memory prodName = prod.name; 
      bytes32 _name;
      //convert string to bytes32
      assembly {
        _name := mload(add(prodName, 32))
      }
      name[i] = _name; 
    }
  }
}