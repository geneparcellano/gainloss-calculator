/*****************************************************************************
Percent Calculator
*****************************************************************************/
var gainLossCalculator = (function($) {
	'use strict';

	var self = {},
		$el = $('.calculator-percent'),
		$form = $el.find('form'),
		$label = $el.find('.form-label'),
		$indicator = $el.find('.indicator'),
		$input = $el.find('input'),
		$initial = $el.find('#initial'),
		$final = $el.find('#final'),
		$pcnt = $el.find('#percent'),
		pattern = /^\d+(\.\d{2})?$/;


	self.init = function() {

		$label.on('click', function() {
			var $this = $(this),
				target = $this.attr('data-target');

			// Reset validation
			$form.parsley('reset');

			// Enable other input
			$form.find('input[disabled="disabled"]')
				.removeAttr('disabled')
				.removeClass('active');

			// Make target input read-only
			$(target)
				.attr('disabled','disabled')
				.addClass('active').val('');

			// Focus on first non-read-only input
			$input.each(function(i) {
				if ($(this).attr('disabled') === undefined ) {
					$(this).focus();
					return false;
				}
			})

			// Activate Nav
			if (!$this.hasClass('active')) {
				$label.removeClass('active');
				$this.addClass('active');

				// Show "Solving for this"
				$indicator.appendTo($this);
			}

			// Remove '%' from value
			if (target !== '#percent') {
				var pcnt = $pcnt.val().replace('%','');
				$pcnt.val(pcnt);

				return true;
			}
		});

		// Clear active input value
		$input.on('keyup', function() {
			$('input.active').val('');
		});

		// Clear placeholder
		$input.on('change', function() {
			$input.removeAttr('placeholder');
		});

		// Start timer
		$input.on('focusout', function() {

			var typingTimer,
				doneTypingInterval = 500; //time in ms, 500 = 5s

			// Solve when require values are present
			$input.on('keyup', function(){
				clearTimeout(typingTimer);

				if ($input.not('.active').val()) {
					typingTimer = setTimeout(solve, doneTypingInterval);
				}
			});

		});

		// Initiate Parsley JS
		$('form').parsley({
			trigger: 'focusin focusout keyup change',
			errorClass: 'has-error',
			errors: {
				classHandler: function(el) {
					return $(el).closest('.form-group');
				},
				errorsWrapper: '<ul class="help-block"></ul>',
				errorElem: '<li></li>'
			},
		});

	}

	function solve() {
		var initial = $initial.val(),
			final = $final.val(),
			pcnt = $pcnt.val(),
			solveFor = $('input.active').attr('id');

		switch (solveFor) {
			case 'initial':
				self.solveInitial(final, pcnt);
				break;
			case 'final':
				self.solveFinal(initial, pcnt);
				break;
			case 'percent':
				self.solvePcnt(initial, final);
				break;
		}
	}

	self.solveInitial = function(final, pcnt) {
		var initial = final / ( ((pcnt) / 100) + 1 ) ;

		if (!initial || initial === Infinity) {
			return false;
		}

		if (pattern.test(initial)) {
			return setValue($initial, initial);
		} else {
			return setValue($initial, initial.toFixed(2));
		}
	}

	self.solveFinal = function(initial, pcnt) {
		var final = ((pcnt/100) * initial) + parseInt(initial);

		if (pattern.test(final)) {
			return setValue($final, final);
		} else {
			return setValue($final, final.toFixed(2));
		}
	}

	self.solvePcnt = function(initial, final) {
		var pcnt = ((final - initial)/initial) * 100;

		if ( pcnt < 0 ) {
			$pcnt.addClass('loss');
		} else {
			$pcnt.removeClass('loss');
		}

		if (pattern.test(pcnt)) {
			return setValue($pcnt, pcnt + '%');
		} else {
			return setValue($pcnt, pcnt.toFixed(2) + '%');
		}
	}

	function setValue($field, value) {
		return $field.val(value);
	}

	return self;
})(jQuery);

