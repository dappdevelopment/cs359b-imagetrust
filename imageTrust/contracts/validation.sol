pragma solidity ^0.4.21;

contract codeValidation {
  address creator = address(0);
  string companyName = "None";
  mapping (string => bytes32) codeHashes; 
  event hashAdded(address _creator, string _fileName, bytes32 _codeHash);

  constructor(string _companyName) public {
    creator = msg.sender;
    companyName = _companyName;
  }

  function addHash(bytes32 _codeHash, string _fileName) public returns (bool success) {
    require(msg.sender == creator);
    codeHashes[_fileName] = _codeHash;
    emit hashAdded(msg.sender, _fileName, codeHashes[_fileName]);
    return true;
  }
}
  
