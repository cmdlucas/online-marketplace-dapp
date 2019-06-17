pragma solidity ^0.5.0;

contract SimpleStorage {
  uint storedData;

  mapping(uint => uint) map;

  function set(uint x) public {
    storedData = x;
  }

  function setMap(uint x, uint y) public {
    map[x] = y;
  }

  function get() public view returns (uint) {
    return storedData;
  }

  function getMap(uint x) public view returns (uint) {
    return map[x];
  }
}
