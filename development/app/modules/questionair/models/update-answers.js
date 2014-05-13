// update-answers.js
// --------------
// Requires define
// Return Backbone Model {Object}

define(["backbone"], function(Backbone, viewTemplate) {

	return Backbone.Model.extend({
		apiUrl: "/api/v1/",
		url : function() {
			return this.apiUrl + "buyer/saveQuestionnaireAnswers";
		}
	});
});
