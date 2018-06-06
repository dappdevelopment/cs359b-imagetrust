
async function init(contractName) {
    console.log("Using web3 version: " + Web3.version);
    if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
    web3 = new Web3(web3.currentProvider); // MetaMask injected Ethereum provider

    // Get the account of the user from metamask
    const userAccounts = await web3.eth.getAccounts(); // resolves on an array of accounts
    userAccount = userAccounts[0];   
    console.log("User account:", userAccount);

    // get javascript object representation of our solidity contract
    console.log(contractName);
    const contractData = await $.getJSON(contractName); //contractName);
    console.log("got data");
    const networkId = await web3.eth.net.getId(); // resolves on the current network id
    console.log(networkId);
    let contractAddress;
    try {
        contractAddress = contractData.networks[networkId].address;
    } catch (e) {
        alert("Contract not found on selected Ethereum network on MetaMask.");
    }
    console.log("contAdd");
    contract = new web3.eth.Contract(contractData.abi, contractAddress);
    console.log("Contract Address:", contract);

    // Register contract's event handlers
    //contractEvents(contractData.abi, networkId);

    return {
	web3_ : web3,
	userAccount_ : userAccount,
	contract_ : contract
    };
}

async function addNewUser() {

  if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
  web3 = new Web3(web3.currentProvider); // MetaMask injected Ethereum provider

  // Get the account of the user from metamask
  const userAccounts = await web3.eth.getAccounts(); // resolves on an array of accounts
  userAccount = userAccounts[0];   
 
  var inpFirstName  = document.getElementById("firstName").value;
  var inpLastName   = document.getElementById("lastName").value;
  var inpCompanyURL = document.getElementById("companyUrl").value;
  var inpEmail      = document.getElementById("emailAdd").value;
  var inpUserName   = document.getElementById("userName").value;
  var inpPassWord   = document.getElementById("password").value;

  let certInfo = {
    userName  : inpUserName,
    firstName : inpFirstName,
    lastName  : inpLastName,
    passHash  : inpPassWord,
    keyLink   : inpCompanyURL,
    key       : userAccount
  }
  fetch('/imagetrust/api/newUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(certInfo),
  })
  .then(function(res) {
    setTimeout(function() {
      window.location.href="../validation.html";
    }, 1000);
  });
}


async function purchaseLicense() {
  if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';

  initVals = await init("contractJSON/licenseToken.json");

  web3 = initVals.web3_; // Ethereum provider injected by MetaMask
  var userAccount = initVals.userAccount_;
  var contract = initVals.contract_;
console.log("Is it here");
  $("#companyName").change(function() {
  var sel = document.getElementById("companyName");
  var companyName = sel.options[sel.selectedIndex].value;
  });
  $("#productName").change(function() {
  var sel = document.getElementById("productName");
  var productName = sel.options[sel.selectedIndex].value; //document.getElementById("firstName").value;
  });

  $("#license-options").change(function() {
  var licenseType = $("input:radio[name=option]:checked").val();
  });



  let data = {
     license: licenseType,
     company: companyName,
     product: productName

  };

  console.log("data");
  console.log(data);
  await fetch('/imagetrust/api/getPrice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  }).then(function(res) {
    return res.json();
  }).then(function(jres) {

    contract.methods.purchase(jres.price*10**18, licenseType).send({from: userAccount});
  });


  contract.methods.getLatestLicense().call({from: userAccount})
    .then(function(uri) {
      console.log("license info");
      console.log(uri);
    });
}


