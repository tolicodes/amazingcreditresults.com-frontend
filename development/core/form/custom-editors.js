define([
	'backbone-forms',
	'hbs!./phone',
	'hbs!./ssn',
	'hbs!./currency',
	'common/formatters',
	'bootstrap-datepicker'
], function(
	Form,
	phoneTpl,
	ssnTpl,
	currencyTpl,
	formatters
){
	Form.editors.MultiText = Form.editors.Base.extend({
		_checkField: function(opts, e) {
			//list of functional/control keys that you want to allow always
            var keys = [8, 9, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 46, 144, 145],
            	keyCode = e.keyCode || e.which,
            	keyPressed = String.fromCharCode(keyCode),
            	text = $(e.target).val() + keyPressed;

            if( _.indexOf(keys, keyCode) !== -1) {
            	return;
            }

            var atMaxLength = text.length > opts.textLength;
            var unMatchedRegex = !text.match(opts.regex);

            if (atMaxLength || unMatchedRegex) {
                e.preventDefault();
                e.stopPropagation();
            }

            if(atMaxLength && opts.goToNextField) {
            	var $field = $(e.target);
            	var index = $field.index();
            	$field
            		.parent()
            		.find(':input')
            		.filter(function(){
            			return $(this).index() > index
            		})
            		.eq(0)
            		.focus()
            		.val(keyPressed)
            }
		},

		render: function(){
			this.$el.html(this.template());
			this._applyFieldRules();
			return this;
		},

		_applyFieldRules: function(){
			_(_(this).result('fieldRules')).each(function(field, key){
				this.$(key).keydown(
					_.bind(this._checkField, this, field)
				);
			}, this);
		}
	});

	Form.editors.Phone = Form.editors.MultiText.extend({
		template: phoneTpl,

		fieldRules: function(){
			var numeric = /\d+/;
			return {
				'.area-code': {
					textLength: 3,
					regex: numeric,
					goToNextField: true
				},
				'.phone-1': {
					textLength: 3,
					regex: numeric,
					goToNextField: true
				},
				'.phone-2': {
					textLength: 4,
					regex: numeric
				}
			};
		},

		className: 'phone-editor',
		
		getValue: function(){
			var areaCode = this.$('.area-code').val(),
				phone1 = this.$('.phone-1').val(),
				phone2 = this.$('.phone-2').val();

			if(areaCode && phone1 && phone2) {
				return areaCode + '-' + phone1 + '-' + phone2;
			} else {
				return '';
			}
		},

		setValue: function(val){
			var phoneRegex = /(\d{3})-(\d{3})-(\d{4})/;
			var match = val.match(phoneRegex);

			if(!match) {
				return;
			}

			this.$('.area-code').val(match[0]);
			this.$('.phone-1').val(match[1]);
			this.$('.phone-2').val(match[2]);
		}
	});

	Form.editors.SSN = Form.editors.MultiText.extend ({
		template: ssnTpl,

		className: 'ssn-editor',

		fieldRules: function(){
			var numeric = /\d+/;
			return {
				'.part-1': {
					textLength: 3,
					regex: numeric,
					goToNextField: true
				},
				'.part-2': {
					textLength: 2,
					regex: numeric,
					goToNextField: true
				},
				'.part-3': {
					textLength: 4,
					regex: numeric,
					goToNextField: true
				}
			};
		},

		getValue: function(){
			return this.$('.part-1').val() + 
				this.$('.part-2').val() + 
				this.$('.part-3').val();
		},
		
		setValue: function(val){
			var phoneRegex = /(\d{3})(\d{4})(\d{2})/;
			var match = val.match(phoneRegex);

			this.$('.part-1').val(match[0]);
			this.$('.part-2').val(match[1]);
			this.$('.part-3').val(match[2]);
		}
	});

	Form.editors.DatePicker = Form.editors.Text.extend({
		render: function(){
			Form.editors.Text.prototype.render.apply(this, arguments);
 			this.$el.addClass('datepicker input-small-custom');
			
			this.$el.datepicker().on('changeDate', function(){
				$(this).datepicker('hide');
			});

			return this;
		}
	});

	Form.editors.Currency = Form.editors.Base.extend({
		template: currencyTpl,

		formatter: formatters.CurrencyFormatter,

		getValue: function(){
			return this.formatter.toRaw(this.$('input').val());
		},
		
		setValue: function(val){
			this.$('input').val(this.formatter.fromRaw(val));
		},

		render: function(){
			this.$el.html(this.template({
				before: '$'
			}));

			return this;
		}
	});
});