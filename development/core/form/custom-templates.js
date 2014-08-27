define([
    'jquery',
    'underscore',
    'backbone',
    'backbone-forms',
    'hbs!./formTpl'
], function(
    $,
    _,
    Backbone,
    Form,
    formTpl
) {
    Backbone.Validation.configure({
        labelFormatter: 'backboneForm'
    });

    Backbone.Validation.labelFormatters.backboneForm = function(attrName, child) {
        return _(child).result('schema')[attrName].title || this.sentenceCase(attrName, child);
    };

    /**
     * Bootstrap 3 templates
     */
    Form.template = formTpl;

    Form.Fieldset.template = _.template('\
    <fieldset data-fields>\
      <% if (legend) { %>\
        <legend><%= legend %></legend>\
      <% } %>\
    </fieldset>\
  ');

    Form.Field.template = _.template('\
    <div class="form-group field-<%= key %>">\
      <label class="" for="<%= editorId %>"><%= title %>\
      <% if(typeof required != "undefined") {%><span class="required">*</span><% } %>\
      </label>\
      <div class="">\
        <span data-editor></span>\
        <div data-error></div>\
        <p class="help-block"><%= help %></p>\
      </div>\
    </div>\
  ');

    Form.NestedField.template = _.template('\
    <div class="field-<%= key %>">\
      <div title="<%= title %>" class="input-xlarge">\
        <span data-editor></span>\
        <div class="help-inline" data-error></div>\
      </div>\
      <div class="help-block"><%= help %></div>\
    </div>\
  ');



    /**
     * Text
     *
     * Text input with focus, blur and change events
     */
    Form.editors.MultipleInput = Form.Editor.extend({

        defaultValue: '',

        previousValue: '',

        template: '\
  	<div class="multiple-input-h">\
    <% for(var i = 1; i <= total; i++ ) { %>\
		<input type="text" class="form-control" />\
		<% if(i != total) { %>\
			- \
		<% } %>\
    <% } %><div>\
    ',

        events: {
            'keyup': 'determineChange',
            'keypress': function(event) {
                var self = this;
                setTimeout(function() {
                    self.determineChange();
                }, 0);
            },
            'select': function(event) {
                this.trigger('select', this);
            },
            'focus': function(event) {
                this.trigger('focus', this);
            },
            'blur': function(event) {
                this.trigger('blur', this);
            }
        },

        initialize: function(options) {
            Form.editors.Base.prototype.initialize.call(this, options);

            var schema = this.schema;

            if (schema && schema.total) this.total = schema.total;
        },

        /**
         * Adds the editor to the DOM
         */
        render: function() {
            this.$el.html(_.template(this.template, {
                total: this.total
            }));
            this.setValue(this.value);
            // this.setValue("123-456-879");
            return this;
        },

        determineChange: function(event) {
            var currentValue = this.$el.val();
            var changed = (currentValue !== this.previousValue);

            if (changed) {
                this.previousValue = currentValue;

                this.trigger('change', this);
            }
        },

        /**
         * Returns the current editor value
         * @return {String}
         */
        getValue: function() {
            var val = [];
            this.$el.find("input").each(function(index) {
                val.push($(this).val());
            });
            return val.join("-");
        },

        /**
         * Sets the value of the form element
         * @param {String}
         */
        setValue: function(value) {
            var s = value.split("-");
            this.$el.find("input").each(function(index) {
                $(this).val(s[index]);
            });
        },

        focus: function() {
            if (this.hasFocus) return;

            this.$el.focus();
        },

        blur: function() {
            if (!this.hasFocus) return;

            this.$el.blur();
        },

        select: function() {
            this.$el.select();
        }

    });



    Form.editors.Base.prototype.className = 'form-control';
    Form.Field.errorClassName = 'has-error';

    Form.Field.prototype.templateData = function() {
        var schema = this.schema;
        return {
            help: schema.help || '',
            title: schema.title,
            fieldAttrs: schema.fieldAttrs,
            editorAttrs: schema.editorAttrs,
            key: this.key,
            editorId: this.editor.id,
            required: this.schema.required
        };
    };

    // override form value
    Form.editors.Date.prototype.getValue = function() {
        var year = this.$year.val(),
            month = this.$month.val(),
            date = this.$date.val();
        if (!year || !month || !date) return null;
        return new Date(year, month, date).toString();
    };


    if (Form.editors.List) {

        Form.editors.List.template = _.template('\
      <div class="bbf-list">\
        <ul class="list-unstyled clearfix" data-items></ul>\
        <button type="button" class="btn bbf-add" data-action="add">Add</button>\
      </div>\
    ');


        Form.editors.List.Item.template = _.template('\
      <li class="clearfix">\
        <div class="pull-left" data-editor></div>\
        <button type="button" class="btn bbf-del" data-action="remove">&times;</button>\
      </li>\
    ');


        Form.editors.List.Object.template = Form.editors.List.NestedModel.template = _.template('\
      <div class="bbf-list-modal"><%= summary %></div>\
    ');

    }


});