pragma solidity ^0.5.0;

/**
 * @title EmitsEvent
 * @dev contract to hold all the events that we emit
 */
contract EmitsEvent {
  event ActionDone(int8 status, string statement);

  function emitActionSuccess(string memory statement) internal
  {
    emit ActionDone(1, statement);
  }

  function emitActionFailure(string memory statement) internal
  {
    emit ActionDone(-1, statement);
  }
}
