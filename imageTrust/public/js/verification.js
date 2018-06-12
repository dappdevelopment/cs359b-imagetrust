var companies = [];

function init() {

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





}

