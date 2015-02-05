# Form Validation

A jQuery plugin helps to create forms with different validation logic.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/Tatiana/form-validation/master/dist/form-validation.min.js
[max]: https://raw.github.com/Tatiana/form-validation/master/dist/form-validation.js

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/form-validation.min.js"></script>
<script>
jQuery(function($) {
  $( 'form' ).form-validation(); // apply plugin to your forms
});
</script>
```

## Documentation

### Form fields should have equal values

Useful for password confirmation. Just add to each *data-equal* attribute with the same value.

### One of the fields should be filled

Useful for *login or email* forms. Add data-or attribute with the same value to each of the fields.

### Validate email/tel/url fields

If the type of the field is one of beforementioned, it will be automatically checked with a proper regExp.

### A password has min 6 symbols

Change it with the options (coming soon).

### Disabled submit button

Don't submit the form if submit button is disabled.

## Examples

### Type new password and confirm it

div class="b-form-field">
  <input type="password" name="PASS" value="" data-equal="pass"">
</div>
div class="b-form-field">
  <input type="password" name="CONFIRM_PASS" value="" data-equal="pass">
</div>

### Type login or email

div class="b-form-field">
  <input type="text" name="LOGIN" value="" data-or="login"">
</div>
div class="b-form-field">
  <input type="email" name="EMAIL" value="" data-or="login">
</div>

## Release History
0.1.0 Basic functionality with unit tests
