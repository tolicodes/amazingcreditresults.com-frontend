/** 
 * Include this template file after backbone-forms.amd.js to override the default templates
 *
 * 'data-*' attributes control where elements are placed
 */
define(['jquery', 'underscore', 'backbone', 'backboneForms'], function($, _, Backbone) {
  var Form = Backbone.Form;

  /**
   * Bootstrap 3 templates
   */
  Form.template = _.template('\
    <form role="form" class="form-inline" role="form">\
      <div data-fieldsets></div>\
      <% if (submitButton) { %>\
        <div class="form-group form-button"><button type="submit" class="btn"><%= submitButton %></button></div>\
      <% } %>\
    </form>\
  ');

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

  Form.editors.Base.prototype.className = 'form-control';
  Form.Field.errorClassName = 'has-error';
  console.log(Form);
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