var companyName = null;
var userAccount = null;
var contract = null;
var companies = [];
var allFileNames = [];
var allFileHashes = [];
var allFileDates = [];

async function init() {

  console.log("Using web3 version: " + Web3.version);
  if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
  web3 = new Web3(web3.currentProvider); // MetaMask injected Ethereum provider

  console.log("web3", web3);
  // Get the account of the user from metamask
  const userAccounts = await web3.eth.getAccounts(); // resolves on an array of accounts
  console.log("here");
  userAccount = userAccounts[0];
  console.log("User account:", userAccount);

  // get javascript object representation of our solidity contract
  const contractData = await $.getJSON("contractJSON/codeValidation.json"); //contractName);
  console.log("got data");
  const networkId = await web3.eth.net.getId(); // resolves on the current network id
  console.log("id", networkId);
  let contractAddress;
  try {
      contractAddress = contractData.networks[networkId].address;
  } catch (e) {
      alert("Contract not found on selected Ethereum network on MetaMask.");
  }
  console.log("contAdd");
  contract = new web3.eth.Contract(contractData.abi, contractAddress);
  console.log("Contract Address:", contract);



  fetch('imagetrust/api/getCompanies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(function(res) {
    return res.json();
  })
  .then(function(jres) {
    console.log(jres.companies);
    companies = jres.companies;


    var counter = 0;
    if(counter<=0){
      $.each(companies, function(val, text) {
        $('#companyName').append( $('<option></option>').val(val).html(text) );
        counter++;
      }); 
    }

  });

  $('#companyName').change(function (e){
    e.preventDefault();
    companyName = ($('#companyName option:selected').text());
  });



  $("#file-dialog").change(function() {
    handleFiles(this.files);
  });


  $('#verifyBTN').click(function () {
    var i;
    for (i=0; i<allFileNames.length; i++) {
      verifyUsingBlockchain(companyName, allFileNames[i], allFileHashes[i]);
    }
  });

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
      document.getElementById("fileName").innerHTML = "File Name: " + fileName;
      document.getElementById("hashValue").innerHTML = "Hash Value of File: " + sha256Hash;
      document.getElementById("company").innerHTML = "Company Name: " + companyName;
    };
    reader.onerror = function() {
    console.error("Could not read the file");
    };
    reader.readAsBinaryString(files.item(i));
  }
  Nfiles = files.length;
}


function verifyUsingBlockchain(companyName, fileName, fileHash) {
  contract.methods.viewSoftInfo(web3.utils.asciiToHex(companyName),
                            web3.utils.asciiToHex(fileName),
                            web3.utils.asciiToHex(fileHash)).call()
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
