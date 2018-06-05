
async function init(contractName) {
    console.log("Using web3 version: " + Web3.version);
    if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
    web3 = new Web3(web3.currentProvider); // MetaMask injected Ethereum provider

    // Get the account of the user from metamask
    const userAccounts = await web3.eth.getAccounts(); // resolves on an array of accounts
    userAccount = userAccounts[0];   
    console.log("User account:", userAccount);

    // get javascript object representation of our solidity contract
    const contractData = await $.getJSON(contractName);
    const networkId = await web3.eth.net.getId(); // resolves on the current network id
    let contractAddress;
    try {
        contractAddress = contractData.networks[networkId].address;
    } catch (e) {
        alert("Contract not found on selected Ethereum network on MetaMask.");
    }
    contract = new web3.eth.Contract(contractData.abi, contractAddress);
    console.log("Contract Address:", contract);

    // Register contract's event handlers
    //contractEvents(contractData.abi, networkId);

    return {
	web3_ : web3,
	userAccount_ : userAccount,
	contract_ : contract
    }
}


function purchaseLicense() {
  if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';

  initVals = await init("licensingToken.json");

  web3 = initVals.web3_ // Ethereum provider injected by MetaMask
  var userAccount = initVals.userAccount_;
  var contract = initVals.contract_;

  contract.methods.purchaseLicense().then{


}


