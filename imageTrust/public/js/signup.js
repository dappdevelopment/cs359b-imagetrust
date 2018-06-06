
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
      window.location.href="../publish.html";
    }, 1000);
  });
}
