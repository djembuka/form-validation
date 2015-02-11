/*
 * form-validation
 * https://github.com/djembuka/form-validation
 *
 * Copyright (c) 2015 Tatiana
 * Licensed under the MIT license.
 */

( function($) {
  'use strict';
  
  $.fn.form_validation = function() {
    
    var defaults = {
      inputTextClass: 'b-input-text',
      inputCheckboxClass: 'b-checkbox',
      fieldBoxClass: 'b-form-field',
      warningClass: 'i-warning',
      disabledClass: 'i-disabled'
    };
    
    return this.each( function() {
      var $this = $( this ),
          options = $.extend( {}, defaults );
      
      if ( $this.data( 'Form' ) ) {
        return;
      }
      
      new Form( this, options );
    });
  };

  function Form( elem, options ) {
    this.options = options;
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
    this.$elem.find( '.' + this.options.inputTextClass ).focus( this.focusElement );
  };

  Form.prototype.clickSubmitButton = function(e) {
    var self = $( e.target ).closest( 'form' ).data( 'Form' );
    self.$elem.submit();
    e.preventDefault();
  };

  Form.prototype.submitForm = function(e) {
    var self = $( e.target ).data( 'Form' );
    if ( self.$submitButton.hasClass( self.options.disabledClass ) || !self.isValid() ) {
      e.preventDefault();
      
      //for unit tests
      self.testFlag = self.testFlag ? 'prevent submition' : undefined;
      return;
    }
    
    if ( self.testFlag ) {
      self.testFlag = 'form submition';
      e.preventDefault();
    }
  };

  Form.prototype.focusElement = function(e) {
    var $item = $( e.target ),
        self = $item.closest( 'form' ).data( 'Form' );
    self.removeWarning( $item );
  };

  Form.prototype.setWarning = function( $elem ) {
    $elem.closest( '.' + this.options.fieldBoxClass ).addClass( this.options.warningClass );
    $elem.closest( '.' + this.options.inputCheckboxClass ).addClass( this.options.warningClass );
    
    if ( this.submitFlag === 0 ) {
      this.firstElement = $elem;
    }
    this.submitFlag = 1;
  };

  Form.prototype.removeWarning = function( $elem ) {
    $elem.closest( '.' + this.options.fieldBoxClass ).removeClass( this.options.warningClass );
  };

  Form.prototype.isValid = function() {
    var self = this;
    
    function check() {
      var top;
      self.submitFlag = 0;
      self.firstElement = undefined;
      
      checkSpecialTypes();
      checkRequiredOr();
      checkEqual();
      checkEmpty();
      
      if ( self.submitFlag === 0 ) {
        return true;
      }
      
      if ( self.firstElement ) {
        self.firstElement.focus();
        
        if ( !isFirstElementVisible() ) {
          top = self.firstElement.offset().top - 50;
          scrollToTop( top );
        }
      }
      return false;						
    }
    
    function scrollToTop( top ) {
      if ( $.scrollTo ) {
        $.scrollTo( top, 500 );
      } else if ( window.scroll ) {
        window.scroll( 0, top );
      } else if ( document.documentElement.scrollTop ) {
        document.documentElement.scrollTop = top;
      }
    }
    
    function isFirstElementVisible() {
      var scrolled = window.pageYOffset || document.documentElement.scrollTop;
      return (self.firstElement.offset().top - scrolled) >= 0;
    }
    
    function checkEqual() {
      var orFieldsObject = {};
          
      self.$elem.find( '[data-equal]' ).each( function() {
        var $filed = $( this ),
            data = $filed.data( 'equal' );
          
        if ( !orFieldsObject[ data ]) {
          orFieldsObject[ data ] = self.$elem.find( '[data-equal=' + data + ']' );
        }
      });
      
      $.each( orFieldsObject, function( key ) {
        var flag = true,
            value = $.trim( $( orFieldsObject[ key ][0] ).val() ),
            method;
            
        orFieldsObject[ key ].each( function() {
          if ( $.trim( $( this ).val() ) !== value ) {
            flag = false;
          }
        });
        
        method = ( flag === false ) ? 'setWarning' : 'removeWarning';
        orFieldsObject[ key ].each( function() {
          self[ method ]( $( this ));
        });
      });
    }
    
    function checkEmpty() {
      self.$elem.find( '[required]' ).each( function() {
        var $field = $( this ),
            val = $.trim( $field.val() );
        
        if ( $field.is( 'input:radio' )) {
          if ( $field.closest( '.' + self.options.fieldBoxClass ).find( 'input:checked' ).length === 0 ) {
            self.setWarning( $field );
          }
        } else if ( $field.is( 'input:checkbox' )) {
          if ( !$field.is( ':checked' )) {
            self.setWarning( $field );
          } else {
            self.removeWarning( $field );
          }
        } else if ( $field.is( '[data-equal]' )) {
          if ( val === '' ) {
            self.setWarning( $field );
          }
        } else if ( val === '' ) {
          self.setWarning( $field );
        } else if( !$field.is( '[type=email]' ) && !$field.is( '[type=tel]' ) && !$field.is( '[type=number]' ) && !$field.is( '[type=url]' )) {
          self.removeWarning( $field );
        }
      });
    }
    
    function checkSpecialTypes() {
      var selector, regExp;
      
      function useRegExp( selector, regExp ) {
        self.$elem.find( selector ).each( function() {
          var $field = $( this ),
            val = $.trim( $field.val() );
          
          if ( val !== '' && !regExp.test( val )) {
            self.setWarning( $field );
          } else {
            self.removeWarning( $field );
          }
        });
      }
      
      //check password
      self.$elem.find( 'input:visible:password' ).each( function() {
        var $field = $( this ),
          val = $.trim( $field.val() ),
          maxLength = 6;
        
        if ( val.length < maxLength ) {
          self.setWarning( $field );
        } else {
          self.removeWarning( $field );
        }
      });
      
      //check email type
      selector = '[type=email]';
      regExp = /^([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})$/i;
      useRegExp( selector, regExp );
      
      //check tel type
      selector = '[type=tel]';
      regExp = /^([0-9-()\++\s]{5,})$/i;
      useRegExp( selector, regExp );
      
      //check number type
      selector = '[type=number]';
      regExp = /^([0-9\s\.,]+)$/i;
      useRegExp( selector, regExp );
      
      //check url type
      selector = '[type=url]';
      regExp = /^((https?:\/\/)?(www\.)?([-a-z0-9]+\.)+[a-z]{2,}(\/[-\w]+)?(\/[-\w]+\.[a-z]{2,})?\/?(#[-\w]+)?(\?[-\w=&]+)?)$/i;
      useRegExp( selector, regExp );
      
    }
    
    function checkRequiredOr() {
      var orFieldsObject = {};
      
      self.$elem.find( '[data-or]' ).each( function() {
        var $filed = $( this ),
          data = $filed.attr( 'data-or' );
          
        if ( !orFieldsObject[ data ]) {
          orFieldsObject[ data ] = self.$elem.find( '[data-or=' + data + ']' );
        }							
      });
      
      $.each( orFieldsObject, function( key ) {
        var counter = 0,
            method;
        
        orFieldsObject[ key ].each( function() {
          if ( $.trim( $( this ).val() ) !== '' ) {
            counter++;
          }
        });
        
        method = ( counter === 0 ) ? 'setWarning' : 'removeWarning';
        orFieldsObject[ key ].each( function() {
          self[ method ]( $( this ));
        });
      });
    }
    
    return check();
  };
}( jQuery ));