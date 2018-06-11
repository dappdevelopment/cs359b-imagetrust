
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
 // $('.anchor').hide();
  /*$('.tab a').on('click', function (e) {
    
    e.preventDefault();
    
    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');
    
    target = $(this).attr('href');
  
    $('.tab-content > div').not(target).hide();
    
    $(target).fadeIn(600);
    
  });*/
  

$('.tab').click(function(){
//  $('.tab-content').hide(); 
  $('.tab-content, .anchor').toggle();
});



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

  initVals = await init("contractJSON/codeValidation.json");

  web3 = initVals.web3_; // Ethereum provider injected by MetaMask
  var userAccount = initVals.userAccount_;
  var contract = initVals.contract_;

  // Get the account of the user from metamask
  const userAccounts = await web3.eth.getAccounts(); // resolves on an array of accounts
  userAccount = userAccounts[0];


  let checkInfo = {
    key : userAccount
  }
  await fetch('/imagetrust/api/checkKey', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(checkInfo),
  })
  .then(function(res) {
    if (res.status == 200) {
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
        return res.json();
      })
      .then(function(jres) {
        setTimeout(function() {
          console.log("about to add");
          contract.methods.addAddress(
            //web3.utils.hexToBytes(
              web3.utils.asciiToHex(jres.company)).send({from: userAccount})
            .then(function() {
              console.log("added");
              window.location.href="../publish.html";
            });
        }, 1000);
      });
    }
    else {
      console.log("key exists");
      //window.location
      return;
    }
  });
}
