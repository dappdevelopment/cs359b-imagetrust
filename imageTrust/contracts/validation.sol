pragma solidity ^0.4.21;

contract code_validation {
  address creator = address(0);
  string company_name = "None"
  mapping (string => bytes32) code_hashes; 

  function code_validation(string _company_name) public {
    creator = msg.sender;
    company_name = _company_name;
  }

}
  
