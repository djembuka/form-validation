( function($) {
  $.fn.form = function() {
    return this.each( function() {
      var $this = $( this );
      
      if ( $this.instance ) {
        return;
      }
      
      $this.instance = new Form( this );
    });
  };

  function Form( elem ) {
    this.init( elem );
  }

  Form.prototype.init = function( elem ) {
    //init variables and elements
    this.$elem = $( elem );
    this.$elem.data( 'Form', this );
    this.submitFlag = 0;
    this.firstElement = undefined;
    this.$submitButton = this.$elem.find( '[type=submit]' );
    
    //handle events
    this.$submitButton.click( this.clickSubmitButton );
    this.$elem.submit( this.submitForm );
    this.$elem.find( '.b-input-text' ).focus( this.focusElement );
  };

  Form.prototype.clickSubmitButton = function(e) {
    var self = $( e.target ).closest( 'form' ).data( 'Form' );
    self.$elem.submit();
    e.preventDefault();
  };

  Form.prototype.submitForm = function(e) {
    var self = $( e.target ).data( 'Form' );
    if ( self.$submitButton.hasClass( 'i-disabled' ) || !self.isValid() ) {
      e.preventDefault();
    }
  };

  Form.prototype.focusElement = function(e) {
    var $item = $( e.target ),
        self = $item.closest( 'form' ).data( 'Form' );
    self.removeWarning( $item );
  };

  Form.prototype.setWarning = function( $elem ) {
    $elem.closest( '.b-form-field' ).addClass( 'i-warning' );
    $elem.closest( '.b-checkbox' ).addClass( 'i-warning' );
    
    if ( this.submitFlag === 0 ) {
      this.firstElement = $elem;
    }
    this.submitFlag = 1;
  };

  Form.prototype.removeWarning = function( $elem ) {
    $elem.closest( '.b-form-field' ).removeClass( 'i-warning' );
  };

  Form.prototype.isValid = function() {
    var self = this;
    
    return check();
    
    function check() {
      self.submitFlag = 0;
      self.firstElement = undefined;
      
      checkSpecialTypes();
      checkRequiredOr();
      checkEqual();
      checkEmpty();
      
      if (self.submitFlag === 0) {
        return true;
      }
      
      var scrolled = window.pageYOffset || document.documentElement.scrollTop;
      if ((self.firstElement.offset().top - scrolled) < 0) {
        var top = self.firstElement.offset().top - 50;
        $.scrollTo( top, 500 );
        if(self.firstElement !== undefined) {
          self.firstElement.focus();
        }
      }
      return false;						
    }
    
    function checkEqual() {
      var orFieldsObject = {};
      self.$elem.find("[data-equal]").each(function() {
        var $filed = $(this),
          data = $filed.attr("data-equal");
          
        if(!orFieldsObject[data]) {
          orFieldsObject[data] = self.$elem.find("[data-equal=" + data + "]");
        }
      });
      
      var flag;
      $.each( orFieldsObject, function( key, value ) {
        flag = true;
        
        var value = $.trim($(orFieldsObject[key][0]).val());
        orFieldsObject[key].each(function() {
          if($.trim($(this).val()) !== value) {
            flag = false;
          }
        });
        
        if(!flag) {
          orFieldsObject[key].each(function() {
            self.setWarning($(this));
          });
        }
        else {
          orFieldsObject[key].each(function() {
            self.removeWarning($(this));
          });
        }
      });
    }
    
    function checkEmpty() {
      self.$elem.find(".b-select.i-required").each(function() {
        if($(this).find("input:hidden").val() === "") {
          self.setWarning($(this));
        } else {
          self.removeWarning($(this));
        }
      });
      self.$elem.find("[required]").each(function() {
        var $field = $(this),
          $val = $.trim($field.val());
        
        if ($field.is("[type=radio]")) {
          if($field.closest(".b-form-field").find("input:checked").size() === 0) {
            self.setWarning($field);
          }
        }
        else if ($field.is("[type=checkbox]")) {
          if(!$field.is(":checked")) {
            self.setWarning($field);
          } else {
            self.removeWarning($field);
          }
        }
        else if ($field.is("[data-equal]")) {
          if($.trim($field.val()) === "") {
            self.setWarning($field);
          }
        }
        else if ($val === "") {
          self.setWarning($field);
        }
        else if(!$field.is("[type=email]") && !$field.is("[type=tel]") && !$field.is("[type=number]") && !$field.is("[type=url]")) {
          self.removeWarning($field);
        }
      });
    }
    
    function checkSpecialTypes() {
      checkPasswordType();
      checkEmailType();
      checkTelType();
      checkNumberType();
      checkUrlType();
      
      function checkPasswordType() {
        self.$elem.find("input:visible[type=password]").each(function() {
          var $field = $(this),
            $val = $.trim($field.val()),
            num = 6;
          
          if ($val.length < num) {
            self.setWarning($field);
          }
          else {
            self.removeWarning($field);
          }
        });
      }
      
      function checkEmailType() {
        self.$elem.find("[type=email]").each(function() {
          var $field = $(this),
            $val = $.trim($field.val()),
            mailRegex = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;
          
          if ($val !== "" && !mailRegex.test($val)) {
            self.setWarning($field);
          }
          else {
            self.removeWarning($field);
          }
        });
      }
      
      function checkTelType() {
        self.$elem.find("[type=tel]").each(function() {
          var $field = $(this),
            $val = $.trim($field.val()),
            phoneRegex = /^([0-9-()\++\s]{5,})$/i;
          
          if ($val !== "" && !phoneRegex.test($val)) {
            self.setWarning($field);
          }
          else {
            self.removeWarning($field);
          }
        });
      }
      
      function checkNumberType() {
        self.$elem.find("[type=number]").each(function() {
          var $field = $(this),
            $val = $.trim($field.val()),
            numRegex = /^([0-9\s\.,]+)$/i;
          
          if ($val !== "" && !numRegex.test($val)) {
            self.setWarning($field);
          }
          else {
            self.removeWarning($field);
          }
        });
      }
      
      function checkUrlType() {
        self.$elem.find("[type=url]").each(function() {
          var $field = $(this),
            $val = $.trim($field.val()),
            urlRegex = /^((https?:\/\/)?(www\.)?([-a-z0-9]+\.)+[a-z]{2,})$/i;
          
          if ($val !== "" && !urlRegex.test($val)) {
            self.setWarning($field);
          }
          else {
            self.removeWarning($field);
          }
        });
      }
      
    }
    
    function checkRequiredOr() {
      var orFieldsObject = {};
      self.$elem.find("[data-or]").each(function() {
        var $filed = $(this),
          data = $filed.attr("data-or");
          
        if(!orFieldsObject[data]) {
          orFieldsObject[data] = self.$elem.find("[data-or=" + data + "]");
        }							
      });
      
      var counter;
      for(var key in orFieldsObject) {
        counter = 0;
        
        orFieldsObject[key].each(function() {
          if($.trim($(this).val()) !== "") {
            counter++;
          }
        });
        
        if(counter === 0) {
          orFieldsObject[key].each(function() {
            self.setWarning($(this));
          });
        }
        else {
          orFieldsObject[key].each(function() {
            self.removeWarning($(this));
          });
        }
      }
    }
  };
}( jQuery ));