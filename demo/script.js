/*! Form Validation - v0.1.0 - 2015-03-09
* https://github.com/djembuka/form-validation
* Copyright (c) 2015 Tatiana; Licensed MIT */
!function(a){a(function(){a(".i-float .b-input-text").focus(function(){a(this).parent(".i-float").addClass("i-focus")}).blur(function(){var b=a(this);""===b.val()&&b.parent(".i-float").removeClass("i-focus")}).each(function(){""!==a(this).val()&&a(this).parent(".i-float").addClass("i-focus")}),a(".i-float .b-label").click(function(){var b=a(this).parent(".i-float");b.hasClass("i-focus")||b.find(".b-input-text").focus()}),a("form").form_validation()})}(jQuery);