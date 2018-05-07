pragma solidity ^0.4.21;

contract code_validation {
  address creator = address(0);


  function code_validation() public {
    creator = msg.sender;
  }

}
  
