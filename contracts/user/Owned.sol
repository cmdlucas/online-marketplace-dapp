pragma solidity ^0.5.0;


/**
 * @title Owned
 * @dev This contract provides owner power
 */
contract Owned {
  address internal owner;

  modifier isOwner {
      require(msg.sender == owner, "Only the owner can perform this action."); _;
  }

  constructor() public {
    // set contract deployer as owner
    owner = msg.sender;
  }
}
