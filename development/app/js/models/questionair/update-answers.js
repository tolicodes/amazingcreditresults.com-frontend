// update-answers.js
// --------------
// Requires define
// Return Backbone Model {Object}

define(["require", "backbone"], function(require, Backbone, viewTemplate) {

	return Backbone.Model.extend({
		apiUrl: "/",
		url : function() {
			return this.apiUrl + "buyer/saveQuestionareAnswers/";
		}
	});
});
