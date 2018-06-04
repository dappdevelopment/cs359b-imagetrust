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

  $('.tab a').on('click', function (e) {
    
    e.preventDefault();
    
    $(this).parent().addClass('active');
    $(this).parent().siblings().removeClass('active');
    
    target = $(this).attr('href');
  
    $('.tab-content > div').not(target).hide();
    
    $(target).fadeIn(600);  
  });

/////////////////////////////////////////////////////////////////////////////////////////

function ConvertFormToJSON(form){
      var formData = jQuery(form).serializeArray();
          var userData = {};
              
              jQuery.each(formData, function() {
                        userData[this.name] = this.value || '';
                            });
                  
                  return userData;
}

jQuery(document).on('ready', function(){
    jQuery('form').bind('submit', function(event){
        event.preventDefault();

        var form = this;
        var userData = ConvertFormToJSON(form);

        $.ajax({
            type: "POST",
            url: "userRegistration.js",
            data: userData,
            dataType: "json",
            success: function(result){
                window.location.href = "/validation.html";
            },
            error: function(){
                $('#loginError').text('Login failed')
            }
        })
    })
})



/*
(function ($) {
    $.fn.serializeFormJSON = function () {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
                } else {
                                                                                                              o[this.name] = this.value || '';
                                                                                                                          }
                                                      });
                                        return o;
                                    };
})(jQuery);

$('form').submit(function (e) {
      e.preventDefault();
          var data = $(this).serializeFormJSON();
              console.log(data);

                  /* Object
                   *         email: "value"
                   *                 name: "value"
                   *                         password: "value"
                   *                              
});
*/