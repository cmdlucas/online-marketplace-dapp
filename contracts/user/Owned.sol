pragma solidity ^0.5.0;


/**
 * @title Owned
 * @dev This contract provides owner power
 */
contract Owned {
  address public owner;
  string ownerFailureStatement = "Only the dApp owner can perform this action.";

  constructor() public {
    // set contract deployer as dApp owner
    owner = msg.sender;
  }
}
