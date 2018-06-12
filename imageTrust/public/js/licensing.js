var userAccount = null
var contract = null

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
        
      var cmpName = null;
      $('#liccompanyName').change(function (e){
        e.preventDefault();  
        cmpName = ($('#liccompanyName option:selected').text());

        let cmpInfo = {
          company : cmpName
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

          var productcounter = 0;
          if(productcounter<=0){
            $.each(jres.software, function(val, text) {
              console.log("soft here");
              $('#licproductName').append( $('<option></option>').val(val).html(text) );
              productcounter++;  
            }); 
          }
        });
      });

      $("#licproductName").change(function() {
        var pdtName = ($('#licproductName option:selected').text());
        console.log("in opts");
        let sftInfo = {
          company  : cmpName,
          software : pdtName 
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
          console.log(jres);

          //var licOptions = jres.durations + 'days,' + jres.prices + ' ether';
          console.log("opts", licOptions);
          document.getElementById("licOptions").innerHTML = "";
          createRadioButton(jres.durations, jres.prices);
        });
      });
      $("#licOptions").change(function()  {
    console.log($("#licOptions input[type='radio']:checked").val());
      });
    });

}

function createRadioButton(duration, price) {

    console.log(duration);
    console.log(price);
    var licOptions = [];
    var i=0;
    for (i=0; i<duration.length; i++) {
      licOptions.push(duration[i] + " Days, " + price[i] + " Ether");
    }

    //   var questions =  [ 	
    //
  
  //////////var licOptions = ["6months", "12monhs", "18months"];
  
  
  //-- we iterate over each question
  /*
  for (i = 0; i < questions.length; i++) { 
     var question;
     var theInput;
     
     var thisQuestion = questions[i];
     
     //-- we get the values arrary for the question
     var theValues =   thisQuestion.values;
     
     
     //-- we set the forms name
     ///////    theForm.setAttribute('name',thisQuestion.formName);
    */
    //-- we iterate over each value and create a input for it and we add the value
    var theInput;
    //-- we creat a label element for the text label.
    var label = document.createElement( 'label');
    //-- we create the form element 
    var theForm = document.createElement("form");
    for (i = 0; i < licOptions.length; i++) { 
      
      theInput = document.createElement("input");
    
      theInput.setAttribute('type',"radio");
      
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
  createRadioButton();
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
