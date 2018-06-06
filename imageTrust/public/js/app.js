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
    
    function infoToBlockchain(companyName, fileName, fileHash) {
      console.log("Adding hash", fileName, fileHash, companyName);
      contract.methods.addSoftInfo(companyName, fileName, fileHash).send({from: userAccount})
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
  }  
$(document).ready(app);  
