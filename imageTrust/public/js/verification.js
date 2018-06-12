var companies = [];

function init() {

  var options = ["one", "two", "three", "four", "five"];
  fetch('imagetrust/api/getCompanies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    //body: JSON.stringify(cmpInfo),
  })
  .then(function(res) {
    return res.json();
  })
  .then(function(jres) {
    console.log(jres.companies);
    companies = jres.companies;


    //$(document).ready(function() {
    var counter = 0;
    if(counter<=0){
      $.each(companies, function(val, text) {
        $('#companyName').append( $('<option></option>').val(val).html(text) );
        counter++;
      }); 
    }

  });





}

