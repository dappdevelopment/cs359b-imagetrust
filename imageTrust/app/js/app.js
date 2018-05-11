function app()	{
	if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
  	web3 = new Web3(web3.currentProvider); // MetaMask injected Ethereum provider
  	console.log("Using web3 version: " + Web3.version);     //Checking Web3 package
	
	console.log(CryptoJS.SHA256("Message"));      //Checking CryptoJS package


        // Variables
        var allFileNames = [];
        var allFileHashes = [];
        var allFileDates = [];
        var Nfiles = 0;


        /*----------Upload Files, Calculate Hash, Timestamp and Display in HTML--------*/
        $("#file-dialog").change(function() {
	handleFiles(this.files);
        });

        function handleFiles(files) {
	  for (var i=0; i<files.length; i++) {
	    var fileName = files[i].name;
            allFileNames.push(fileName);
            var reader = new FileReader();
            reader.onload = function() {
              var sha256Hash = CryptoJS.SHA256(reader.result);
              allFileHashes.push(sha256Hash);
              var date = new Date().toLocaleString();
              allFileDates.push(date);
              console.log("Hash is " + sha256Hash);
	      document.getElementById("fileDetailsText").innerHTML = "File Details";
	      document.getElementById("hashValue").innerHTML = "Hash Value of File: " + sha256Hash;
              document.getElementById("fileName").innerHTML = "File Name: " + fileName;	
	      document.getElementById("timeStamp").innerHTML = "Time Stamp: " + date;
	    };
            reader.onerror = function() {
            console.error("Could not read the file");
            };
            reader.readAsBinaryString(files.item(i));
          }
          Nfiles = files.length;
        }



        var contract;
        var userAccount;

	var contractDataPromise = $.getJSON('codeValidation.json');
	var networkIdPromise = web3.eth.net.getId(); // resolves on the current network id
	var accountsPromise = web3.eth.getAccounts(); // resolves on an array of accounts
      
	Promise.all([contractDataPromise, networkIdPromise, accountsPromise])
	  .then(function initApp(results) {
	    var contractData = results[0];  // resolved value of contractDataPromise
	    var networkId = results[1];     // resolved value of networkIdPromise
	    var accounts = results[2];      // resolved value of accountsPromise
	    userAccount = accounts[0];
      
	    // (todo) Make sure the contract is deployed on the network to which our provider is connected
      
	    var contractAddress = contractData.networks[networkId].address;
	    contract = new web3.eth.Contract(contractData.abi, contractAddress);
	  })
	  .then(function () {
	    console.log(userAccount);
	    console.log(contract);
	});

        function hashToBlockchain(fileName, fileHash) {
          console.log("Adding hash", fileName, fileHash);

          contract.methods.addHash(fileHash, fileName).send({from: userAccount})
            .then(function showRes() {
              $('#validateBTN').text("Pushed to blockchain");
            }).then(function () {
              console.log("Hash added to the blockchain")
            }).catch(function (e) {
              console.log("Error in addHash was caught")
            });
        }

        $('#validateBTN').click(function () {
          var i
          for (i=0; i<allFileNames.length; i++) {
            hashToBlockchain(allFileNames[i], web3.utils.hexToBytes(web3.utils.toHex(allFileHashes[i])));
          }
        });


      } 
$(document).ready(app);  
