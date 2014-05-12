// home.js
// --------------
// Requires define
// Return Backbone View {Object}

define(["require", "backbone", "text!templates/questionair/questionair.html", "models/questionair/questionair", "models/questionair/update-answers"], function(require, Backbone, viewTemplate, questionairModel, updateAnswersModel) {

	return Backbone.View.extend({

		events : {
			'submit .find-trade-form' : 'updateQuestionair',
			'click .questainair-options' : 'updateAnswerFn'
		},

		el : 'body',

		questions : [{
			question : "What is the length of your credit history (the date you opened your first account)?",
			options : ["< 1 year", "1-3 years", "3-10 years", "> 10 year"]
		}, {
			question : "What is your credit score?",
			options : ["280 - 559", "560 - 659", "660 - 724", "725 - 759", "760 - 850"]
		}, {
			question : "What if your debt to income ratio (field for total credit card debt, field for annual income)",
			options : ["<span>Total Debt:</span>  $<input type='text' /> ", "<span>Annual Income:</span>  $<input type='text' /> ", "<span>Your DTI: x%</span>"]
		}],

		updateAnswer : {
			answer1 : '',
			answer2 : '',
			answer3 : ''
		},

		updateAnswerFn : function(e) {
			this.updateAnswer['answer' + $(e.currentTarget).data("question")] = $(e.currentTarget).data("answer");
		},

		// uodate questionair
		updateQuestionair : function(e) {
			e.preventDefault();
			var _self = this, count = 0;
			qModel = new questionairModel, updateAnswers = new updateAnswersModel;
			qModel.id = "536abf6eeceb3f5404aef098";

			// get questainair
			var questionair = $(e.target).find(".questionair").is(':checked');
			// set update questnair status
			qModel.set({
				needQuestionare : questionair
			});

			// set update aswers
			updateAnswers.set(this.updateAnswer);

			updateAnswers.save({
				success : function() {
					count++;
					_self.goToBuyerPage(count);
				},
				error : function() {
					alert("Some error occured");
				}
			});

			qModel.save({
				success : function() {
					count++;
					_self.goToBuyerPage(count);
				},
				error : function() {
					alert("Some error occured");
				}
			});
		},

		goToBuyerPage : function(count) {
			if (count == 2) {
				App.routing.navigate("buyer", {
					trigger : true
				});
			}
		},

		// main initialize function
		initialize : function(options) {
		},

		render : function() {
			this.$el.html(_.template(viewTemplate, {
				questions : this.questions
			}));
		}
	});
});
