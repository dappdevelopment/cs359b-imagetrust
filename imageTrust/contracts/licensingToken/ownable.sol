pragma solidity ^0.4.23;

contract Ownable {

  address public owner;
  address public imageTrust='0xE4Fe1a25BA4aab866F00285088D20E39Cd2c9d3e'

  constructor() public {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
  }

  modifier onlyOwnerIMGT() {
    require((msg.sender == owner) || (msg.sender == imageTrust));
  }
}
