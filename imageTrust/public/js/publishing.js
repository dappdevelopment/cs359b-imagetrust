var companyName = null;
var firstName = null;
var lastName = null;
var userAccount = null;
var contract = null;
var allFileNames = [];
var allFileHashes = [];
var allFileDates = [];
var Nfiles = 0;


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

    // Register contract's event handlers
    //contractEvents(contractData.abi, networkId);

    ///  Get company name  ///
    console.log("key", userAccount);
    let cmpInfo = {
      key : userAccount
    }
    fetch('imagetrust/api/getUserInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(cmpInfo),
    })
    .then(function(res) {
      console.log(res);
      return res.json();
    })
    .then(function(jres) {
      firstName = jres.firstName;
      lastName = jres.lastName;
      companyName = jres.company;
    });
    
    /*----------Upload Files, Calculate Hash, Timestamp and Display in HTML--------*/
    $("#publishFile-dialog").change(function() {
      handleFiles(this.files);
    });
    $("#verifyFile-dialog").change(function() {
      vhandleFiles(this.files);
    });
    $("#file-dialog").change(function() {
      handleFiles(this.files);
    });
    
    $('#validateBTN').click(function () {
      var i;
      for (i=0; i<allFileNames.length; i++) {
        infoToBlockchain(companyName, allFileNames[i], allFileHashes[i]);
      }
    });
  
    $('#verifyBTN').click(function () {
      var i;
      for (i=0; i<allFileNames.length; i++) {
        verifyUsingBlockchain(companyName, allFileNames[i], allFileHashes[i]);
      }
    });

    $('.optionsForm').on('submit', function (e) {
      e.preventDefault();
      var obj = {"company" : companyName};
      var licenseOptions = $(this).serializeArray();
      for (var a = 0; a < licenseOptions.length; a++) obj[licenseOptions[a].name] = licenseOptions[a].value;
      var licenseJSON = JSON.stringify(obj);
      console.log(JSON.stringify(obj));
      fetch('/imagetrust/api/addLicense', {
	method: 'POST',
	headers: {
	  'Content-Type': 'application/json'
	},
	body: JSON.stringify(obj),
      });

    });
 
}


function userLogin() {
  var inpUserName   = document.getElementById("userName").value;
  var inpPassWord   = document.getElementById("password").value;

  console.log("key", userAccount);
  let loginInfo = {
    userName : inpUserName,
    passHash : inpPassWord
  }
  fetch('imagetrust/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginInfo),
  })
  .then(function(res) {
    if (res.status == 200) {
      window.location.href="../publish.html";
    }
    else {
      console.log("did not match");
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
 
function vhandleFiles(files) {
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
      document.getElementById("vfileName").innerHTML = "File Name: " + fileName;
            document.getElementById("vhashValue").innerHTML = "Hash Value of File: " + sha256Hash;
      
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
  console.log("console", contract);
  console.log(companyName, fileName, fileHash);
  contract.methods.addSoftInfo(web3.utils.asciiToHex(companyName), 	
    			   web3.utils.asciiToHex(fileName), 
    			   web3.utils.asciiToHex(fileHash)).send({from: userAccount})
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



$('.form').find('input, textarea').on('keyup blur focus', function (e) {
  var $this = $(this),
      label = $this.prev('label');
    if (e.type === 'keyup') {
      if ($this.val() === '') {
          label.removeClass('active highlight');
        } else {
          label.addClass('active highlight');
        }
    } else if (e.type === 'blur') {
      if( $this.val() === '' ) {
        label.removeClass('active highlight'); 
      } else {
        label.removeClass('highlight');   
      }   
    } else if (e.type === 'focus') {
      
      if( $this.val() === '' ) {
        label.removeClass('highlight'); 
      } 
      else if( $this.val() !== '' ) {
        label.addClass('highlight');
      }
    }
});
$('.tab').on('click', function (e) {
  e.preventDefault();
  $(this).parent().addClass('active');
  $(this).parent().siblings().removeClass('active');
  target = $(this).attr('href');
  $('.tab-content > div').not(target).hide();
  $(target).fadeIn(600);
});  
