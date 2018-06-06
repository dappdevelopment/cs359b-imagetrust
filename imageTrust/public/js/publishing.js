// Variables
var allFileNames = [];
var allFileHashes = [];
var allFileDates = [];
var Nfiles = 0;
var firstName = null;
var lastName  = null;
var companyName = null;


async function loginData() {

  console.log("in logindata");
  var inpUserName = document.getElementById("userName").value;
  var inpPassword = document.getElementById("password").value;
  console.log("USERNAME");
  console.log(inpUserName);
  //console.log("Stringified UN" + inpUserName.toString());

  let lgDB = {
    userName: inpUserName,  //"testUser0",
    passHash: inpPassword  //"superdupersecret",
  };
  console.log(lgDB);
  fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(lgDB),
  }).then(function(res) {
     console.log(res.status);
    if (res.status == 200) {
      console.log("signedin");
      return res.json();
    }
    else if (res.status == 401) {
      console.log("failedin");
    }
    else {
      throw err;
    }
  }).then(function(jres) {
    firstName 	= jres.firstName;
    lastName  	= jres.lastName;
    companyName = jres.company;
    window.location.href="../validation.html";
  });
}


async function init(contractName) {
    console.log("Using web3 version: " + Web3.version);
    if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?'    ;
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


function handleFiles(files) {
  for (var i=0; i<files.length; i++) {
    var fileName = files[i].name;
    allFileNames.push(fileName);
    // document.getElementById("fname").innerHTML = fileName;
    var reader = new FileReader();
    reader.onload = function() {
      var sha256Hash = CryptoJS.SHA256(reader.result).toString();
      allFileHashes.push(sha256Hash);
      var date = new Date().toLocaleString();
      allFileDates.push(date);
      console.log("Hash is " + sha256Hash);
      document.getElementById("fileDetailsText").innerHTML = "File Details";
      document.getElementById("hashValue").innerHTML = "Hash Value of File: " + sha256Ha    sh;
      document.getElementById("fileName").innerHTML = "File Name: " + fileName;
      document.getElementById("timeStamp").innerHTML = "Time Stamp: " + date;
      document.getElementById("company").innerHTML = "Company Name: " + companyName;
    };
    reader.onerror = function() {
    console.error("Could not read the file");
    };
    reader.readAsBinaryString(files.item(i));
  }
  Nfiles = files.length;
}


function infoToBlockchain(companyName, fileName, fileHash) {
  console.log("Adding hash", fileName, fileHash, companyName);
  contract.methods.addSoftInfo(companyName, fileName, fileHash).send({from: userAccoun    t})
    .then(function showRes() {
      $('#validationResult').css("color", "green");
      $('#validationResult').text("Image Pushed to blockchain");
    }).then(function () {
      console.log("Hash added to the blockchain");
    }).catch(function (err) {
      console.log("Error in addHash was caught");
    });
}


function verifyUsingBlockchain(companyName, fileName, fileHash) {
  contract.methods.viewSoftInfo(companyName, fileName, fileHash).call()
    .then(function showRes(truth)  {
      if (!truth) {
        throw new Error("Not verified");
      }
      $('#verificationResult').css("color", "green");
      $('#verificationResult').text("Image Verified Using Blockchain");
    }).then(function () {
      console.log("File Verified");
    }).catch(function (err) {
      $('#verificationResult').css("color", "red");
      $('#verificationResult').text("Image not verified");
      console.log("Error in verifying");
    });
}


async function publishCode() {

  if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';

  initVals = await init("contractJSON/codeValidation.json");

  web3 = initVals.web3_ // Ethereum provider injected by MetaMask
  var userAccount = initVals.userAccount_;
  var contract = initVals.contract_;

  var i;
  for (i=0; i<allFileNames.length; i++) {
    infoToBlockchain(companyName, allFileNames[i], allFileHashes[i]);
  }
}


async function validateCode() {

  if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';

  initVals = await init("contractJSON/codeValidation.json");

  web3 = initVals.web3_ // Ethereum provider injected by MetaMask
  var userAccount = initVals.userAccount_;
  var contract = initVals.contract_;

  var i;
  for (i=0; i<allFileNames.length; i++) {
    verifyUsingBlockchain(companyName, allFileNames[i], allFileHashes[i]);
  }
}


/*----------Upload Files, Calculate Hash, Timestamp and Display in HTML--------*/
$("#file-dialog").change(function() {
  handleFiles(this.files);
});



$('#validateBTN').click(function () {
  publishCode();
});


$('#verifyBTN').click(function () {
  validateCode();
});


