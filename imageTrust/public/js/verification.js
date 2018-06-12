  var options = ["one", "two", "three", "four", "five"];

  var counter = 0;
  $('.dropdown').on('click', function (e){
    e.preventDefault();
    if(counter<=0){
      $.each(options, function(val, text) {
        $('#companyName').append( $('<option></option>').val(val).html(text) );
        counter++;
      }); 
    }
  });

