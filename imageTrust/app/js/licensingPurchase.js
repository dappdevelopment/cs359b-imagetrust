function app()  {
  if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
  web3 = await new Web3(web3.currentProvider); // MetaMask injected Ethereum provider
  console.log("Using web3 version: " + Web3.version);     //Checking Web3 package
  console.log(CryptoJS.SHA256("Message"));      //Checking CryptoJS package

  ///  Network and user information  ///
  var networkID         = await web3.eth.net.getId(); // resolves on the current network id
  var accountsPromise   = await web3.eth.getAccounts(); // resolves on an array of accounts
  var userAccount       = accountsPromise[0];

  ///  Setting up the contract  ///
  var contractData    = await $.getJSON('codeValidation.json');
  var contractAddress = await contractData.networks[networkID].address;
  var contract        = new web3.eth.Contract(contractData.abi, contractAddress);


  // Variables
  var allFileNames = [];
  var allFileHashes = [];
  var allFileDates = [];
  var Nfiles = 0;
  var companyName = null;
  $("#companyName").change(function() {
    var sel = document.getElementById("companyName");
    companyName = sel.options[sel.selectedIndex].value;
  });

        /*----------Upload Files, Calculate Hash, Timestamp and Display in HTML--------*/
  $("#file-dialog").change(function() {
    handleFiles(this.files);
  });

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
        document.getElementById("hashValue").innerHTML = "Hash Value of File: " + sha256Hash;
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

  ///  purchase licensing  ///
  //TODO: grab price from sql database to be more secure
  function purchaseLicense(companyName, license, time, price) {
    await contract.methods.createLicense(companyName, price, license, time);
  }





  
$(document).ready(app);
  }

