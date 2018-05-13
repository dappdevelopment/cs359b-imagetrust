pragma solidity ^0.4.21;

contract codeValidation {
  address CREATOR = address(0);
  string COMPANYNAME = "None";
  mapping (string => mapping (string => string)) codeHashes; 
  event hashAdded(address _creator, string _fileName, string _codeHash);

  constructor(string _companyName) public {
    CREATOR = msg.sender;
    COMPANYNAME = _companyName;
  }

  function addSoftInfo(string _companyName, string _fileName, string _codeHash) public returns (bool success) {
    //require(msg.sender == CREATOR);
    codeHashes[_companyName][_fileName] = _codeHash;
    emit hashAdded(msg.sender, _fileName, codeHashes[_companyName][_fileName]);
    return true;
  }

  function viewSoftInfo(string _companyName, string _fileName, string _fileHash) public view returns (bool) {
    bool hashTruth = (keccak256(_fileHash) == keccak256(codeHashes[_companyName][_fileName]));
    return hashTruth; 
  }
}
  
