var userAccount = null;
var contract = null;
var company = null;
var software = null;
var duration = null;
var price = null;
var ownedLicenses = [];
var licenseCmps = [];
var licenseEdts = [];
var licenseTkid = [];

async function init() {
  console.log("Using web3 version: " + Web3.version);
  if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
  web3 = new Web3(web3.currentProvider); // MetaMask injected Ethereum provider
  // Get the account of the user from metamask
  const userAccounts = await web3.eth.getAccounts(); // resolves on an array of accounts
  userAccount = userAccounts[0];   
  console.log("User account:", userAccount);

  // get javascript object representation of our solidity contract
  const contractData = await $.getJSON("contractJSON/licenseToken.json"); //contractName);
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

  getLicenses();

  // Register contract's event handlers
  //contractEvents(contractData.abi, networkId);
  $(document).ready(function(){
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
          $('#liccompanyName').append( $('<option></option>').val(val).html(text) );
          counter++;
        }); 
      }
    });
      
    $('#liccompanyName').change(function (e){
      e.preventDefault();  
      company = ($('#liccompanyName option:selected').text());

      let cmpInfo = {
        company : company
      }
      fetch('imagetrust/api/getSoftware', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cmpInfo),
      })
      .then(function(res) {
        return res.json();
      })
      .then(function(jres) {
        console.log("soft");
        console.log(jres);
        console.log(jres.software);

        var uniqueSoftwares = [];      
        $.each(jres.software, function(i, el){ 
            if($.inArray(el, uniqueSoftwares) === -1) uniqueSoftwares.push(el);
        });    
        console.log(uniqueSoftwares);   


        var productcounter = 0;
        if(productcounter<=0){
          $.each(uniqueSoftwares, function(val, text) {    /////////////////////////////////////////
            console.log("soft here");
            $('#licproductName').append( $('<option></option>').val(val).html(text) );
            productcounter++;  
          }); 
        }
      });
    });

    $("#licproductName").change(function() {
      software = ($('#licproductName option:selected').text());
      console.log("in opts");
      let sftInfo = {
        company  : company,
        software : software 
      }
      fetch('imagetrust/api/getPrices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sftInfo),
      })
      .then(function(res) {
        return res.json();
      })
      .then(function(jres) {
        console.log("prices");

        //var licOptions = jres.durations + 'days,' + jres.prices + ' ether';
        console.log("opts", licOptions);
        document.getElementById("licOptions").innerHTML = "";
        createRadioButton(jres.durations, jres.prices);
      });
    });
    $("#licOptions").change(function()  {
      console.log($("#licOptions input[type='radio']:checked").val());
      var strToParse = ($("#licOptions input[type='radio']:checked").val());     ///////////////////////////////////////////////
      var licenseOptionParse = strToParse.split(" Days, ");    //////////////////////////////////////////
      var licensePrice = (licenseOptionParse[1].split(" Ether"));    ////////////////////////////////////////////////////
      var licPrice = parseFloat(licensePrice[0]);    ////////////////////////////////////////////////
      var licDuration = parseInt(licenseOptionParse);

      duration = parseInt(licenseOptionParse);
      price = licPrice;    
    });
  });

}

async function getLicenses() {
  await contract.methods.getLicenses().call({from: userAccount})
    .then(function(lics) {
      ownedLicenses = [];
      licenseCmps = [];
      licenseEdts = [];
      licenseTkid = [];

      console.log(lics[0]);
      var i=0;
      var j=0;
      for (i=0; i<lics[0].length; i++) {
        console.log(i);
	j = lics[0][i].length-1;
	while (lics[0][i].charAt(j) == 0) {
	  j = j-1;
	}
	ownedLicenses.push(web3.utils.toAscii(lics[0][i].substring(0,j+1)));
        console.log(web3.utils.toAscii(lics[0][i].substring(0,j+1)));

	j = lics[1][i].length-1;
	while (lics[1][i].charAt(j) == 0) {
	  j = j-1;
	}
	licenseCmps.push(web3.utils.toAscii(lics[1][i].substring(0,j+1)));
        console.log("date", lics[2][i]);
        var date = new Date(lics[2][i]);
        licenseEdts.push(date.toLocaleDateString());
        console.log(date.getMonth());
        licenseTkid.push(lics[3][i]);
      }
      console.log(ownedLicenses);
      console.log(licenseCmps);
      console.log(licenseEdts);
      console.log(licenseTkid);

    });
  $(".licOwnedList").html(ownedLicenses);
  console.log(ownedLicenses);
}
 
function createRadioButton(duration, price) {

  console.log(duration);
  console.log(price);
  var licOptions = [];
  var i=0;
  for (i=0; i<duration.length; i++) {
    licOptions.push(duration[i] + " Days, " + price[i] + " Ether");
  }

  //-- we iterate over each value and create a input for it and we add the value
  var theInput;
  //-- we creat a label element for the text label.
  var label = document.createElement( 'label');
  //-- we create the form element 
  var theForm = document.createElement("form");
  for (i = 0; i < licOptions.length; i++) { 
    
    theInput = document.createElement("input");
  
    theInput.setAttribute('type',"radio");
    theInput.setAttribute('name', "options");
    
  ///////////  theInput.setAttribute('name',thisQuestion.radioName);
    theInput.setAttribute('value',licOptions[i]);
   
    
    //-- we add the input to its text label.  ( put it insdie of it )
    label.appendChild(theInput);
    label.innerHTML += "<span> " + licOptions[i] + "</span><br>";
    //--we add the label to the form.
    theForm.appendChild( label);
  }
 
  //-- we get the correct Hype element to append to.
  licenseOptions = document.getElementById("licOptions");
  licenseOptions.appendChild(theForm);
}



async function purchaseLicense() {
  if (typeof web3 == 'undefined') throw 'No web3 detected. Is Metamask/Mist being used?';
/*-----------------------------------------------------------------
  initVals = await init("contractJSON/licenseToken.json");

  web3 = initVals.web3_; // Ethereum provider injected by MetaMask
  var userAccount = initVals.userAccount_;
  var contract = initVals.contract_;
  ---------------------------------------------------------------*/
  /*
  console.log("Is it here");
  $("#companyName").change(function() {
  var sel = document.getElementById("companyName");
  var companyName = sel.options[sel.selectedIndex].value;
  });
  $("#productName").change(function() {
  var sel = document.getElementById("productName");
  var productName = sel.options[sel.selectedIndex].value; //document.getElementById("firstName").value;
  createRadioButton();
  });

  $("#license-options").change(function() {
  var licenseType = $("input:radio[name=option]:checked").val();
  });
  */



  var curTime = new Date().getTime();
  var endTime = curTime + parseInt(duration)*24*3600*1000;
  var priceWei = price*10**18;
  contract.methods.purchase(priceWei, web3.utils.asciiToHex(company), 
      web3.utils.asciiToHex(software), endTime).send(
      {from: userAccount, value: priceWei});


  getLicenses();
}


$('#EntityName').on('change', function() {
  if ($(this).val() == 'company1') {
      $('#imghide').removeClass('hide');
  } else {
      $('#imghide').addClass('hide');
  }
});



















        var companies = ["Google", "Apple", "Amazon", "Facebook", "Microsoft"];


        var companycounter = 0;
        $('#companydropdown').on('click', function (e){
          e.preventDefault();
          if(companycounter<=0){
        $.each(companies, function(val, text) {
          $('#liccompanyName').append( $('<option></option>').val(val).html(text) );
          companycounter++;  
        }); }
        });

      
        var products = ["Chrome", "Google Drive", "Google Maps", "Calendar", "Project Shield"];
        var productcounter = 0;

   $('#liccompanyName').change(function (e){
    e.preventDefault();  
      if($('#liccompanyName option:selected').val() == 0){    
          if(productcounter<=0){
        $.each(products, function(val, text) {
          $('#licproductName').append( $('<option></option>').val(val).html(text) );
          productcounter++;  
        }); 
      }
    } 
  }); 
