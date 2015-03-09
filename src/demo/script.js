( function($) {
  $( function() {
  
    $('.i-float .b-input-text').focus(function() {
        $(this).parent('.i-float').addClass('i-focus');
    }).blur(function() {
        var $this = $(this);
        if ( '' === $this.val()) {
          $this.parent('.i-float').removeClass('i-focus');
        }
    }).each(function() {
        if ( '' !== $(this).val()) {
          $(this).parent('.i-float').addClass('i-focus');
        }
    });
    
    $('.i-float .b-label').click(function() {
        var $this = $(this).parent('.i-float');
        if ( !$this.hasClass('i-focus')) {
          $this.find('.b-input-text').focus();
        }
    });
    
    $( 'form' ).form_validation();
   
  });
}( jQuery ));
