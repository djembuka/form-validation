(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('jQuery#form_validation', {
    // This will run before each test in this module.
    setup: function() {
      this.elem = $('#qunit-fixture form');
      this.input = this.elem.find( 'input' );
      this.elem.form_validation();
      this.instance = this.elem.data( 'Form' );
      //use to prevent form submition as well as detect actions
      this.instance.testFlag = true;
    }
  });

  test('is chainable', function() {
    expect(1);
    // Not a bad test to run on collection methods.
    strictEqual(this.elem.form_validation(), this.elem, 'should be chainable');
  });
  
  test( 'form submit', function() {
    expect(1);
    this.instance.$submitButton.addClass( 'i-disabled' );
    this.elem.submit();
    equal( this.instance.testFlag, 'prevent submition', 'Disabled button prevents submit' );
  });
  
  test( 'empty required fields are highlighted', function() {
    expect(2);
    
    this.input.attr({ required: 'required'});
    this.elem.submit();
    
    equal( this.instance.testFlag, 'prevent submition', 'empty required fields prevent submition' );
    equal( this.input.filter( ':eq(1)' ).parent().hasClass( 'i-warning' ), true, 'empty required field has warning class' );
  });
  
  test( 'fields with data-equal attribute must have equal values', function() {
    expect(2);
    
    this.input.attr({ 'data-equal': 'text' });
    this.elem.submit();
    
    equal( this.instance.testFlag, 'form submition', 'submit form when equal fields are equal' );
    
    this.input.filter( ':eq(0)' ).val( 'some' );
    this.elem.submit();
    
    equal( this.instance.testFlag, 'prevent submition', 'prevent submition if values differ' );
  });
  
  test( 'one of the fields with data-or attribute must be filled', function() {
    expect(2);
    
    this.input.attr({ 'data-or': 'text' });
    this.elem.submit();
    
    equal( this.instance.testFlag, 'prevent submition', 'empty fields with equal data-or attribute prevent submition' );
    
    this.input.filter( ':eq(0)' ).val( 'some' );
    this.elem.submit();
    
    equal( this.instance.testFlag, 'form submition', 'if at least one field is filled then submit the form' );
  });
  
  test( 'password should has at least 6 symbols', function() {
    expect(2);
    
    var passField = this.input.filter( ':eq(0)' ).attr({ type: 'password' });
    passField.val( '12345' );
    this.elem.submit();
    
    equal( this.instance.testFlag, 'prevent submition', 'password is too small, don\'t sumbit the form' );
    
    passField.val( '123456' );
    this.elem.submit();
    
    equal( this.instance.testFlag, 'form submition', 'password length is all right, let\'s submit' );
    
  });
  
  test( 'email field must match reg exp', function() {
    expect(2);
    
    var emailField = this.input.filter( ':eq(0)' ).attr({ type: 'email' });
    emailField.val( 'something.ru' );
    this.elem.submit();
    
    equal( this.instance.testFlag, 'prevent submition', 'if doesn\'t match then don\'t submit' );
    
    emailField.val( 'somebody@something.ru' );
    this.elem.submit();
    
    equal( this.instance.testFlag, 'form submition', 'if it\'s a real email then sumbit' );
  });
  
  test( 'tel field must match reg exp', function() {
    expect(2);
    
    var telField = this.input.filter( ':eq(0)' ).attr({ type: 'tel' });
    telField.val( 'something' );
    this.elem.submit();
    
    equal( this.instance.testFlag, 'prevent submition', 'if doesn\'t match then don\'t submit' );
    
    telField.val( '+7 (903) 166-30-36' );
    this.elem.submit();
    
    equal( this.instance.testFlag, 'form submition', 'if it\'s a real phone number then sumbit' );
  });
  
  test( 'url field must match reg exp', function() {
    expect(2);
    
    var urlField = this.input.filter( ':eq(0)' ).attr({ type: 'url' });
    urlField.val( 'something' );
    this.elem.submit();
    
    equal( this.instance.testFlag, 'prevent submition', 'if doesn\'t match then don\'t submit' );
    
    urlField.val( 'http://www.foodclub.ru/foodshot/index.php#at?param=1&value=2' );
    this.elem.submit();
    
    equal( this.instance.testFlag, 'form submition', 'if it\'s a real url then sumbit' );
  });

}(jQuery));
