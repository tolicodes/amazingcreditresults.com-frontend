// home.js
// --------------
// Requires define
// Return Backbone View {Object}

define(["require", "backbone", "hbs!templates/questionair/questionair", "models/questionair/questionair", "models/questionair/update-answers"], function(require, Backbone, viewTemplate, questionairModel, updateAnswersModel) {

	return Backbone.View.extend({

		events : {
			'submit .find-trade-form' : 'updateQuestionair',
			'click .questainair-options' : 'updateAnswerFn',
			'keyup .total-dept' : 'updateAmount',
			'keyup .anual-income' : 'updateAmount',
		},

		el : 'body',

		questions : [{
			question : {
				q : "What is the length of your credit history (the date you opened your first account)?",
				options : ["< 1 year", "1-3 years", "3-10 years", "> 10 year"],
				linkRequired : true
			},
			idx: 1

		}, {
			question : {
				q : "What is your credit score?",
				options : ["280 - 559", "560 - 659", "660 - 724", "725 - 759", "760 - 850"],
				linkRequired : true
			},
			idx: 2
		}, {
			question : {
				q : "What if your debt to income ratio (field for total credit card debt, field for annual income)",
				options : ["<span>Total Debt:</span>  $<input type='text' class='total-dept' /> ", "<span>Annual Income:</span>  $<input type='text' class='anual-income' /> ", "<span>Your DTI: x%</span> <span class='result'></span>"],
				linkRequired : false
			},
			idx: 3
		}],

		// answer range for calculated questions
		answersRange : {
			'3' : [{
				min : 0,
				max : 2
			}, {
				min : 2,
				max : 5
			}, {
				min : 5,
				max : 10
			}, {
				min : 10,
				max : '>'
			}]
		},

		updateAnswer : {
			answer1 : '',
			answer2 : '',
			answer3 : ''
		},

		// update amount
		updateAmount : function(e) {
			var index = parseInt($(e.target).parents('.question-index').data("question")) + 1, dept = this.$el.find(".total-dept").val(), annual = this.$el.find(".anual-income").val(), cal;
			cal = parseInt(dept) + parseInt(annual);
			this.$el.find(".result").html(cal);
			// value is hardcoded right now
			this.updateAnswer['answer' + index] = this.getTheRange(2, index);
		},

		// get the value range in answers
		getTheRange : function(val, idx) {
			var index = -1;
			for (var i in this.answersRange[idx]) {
				if (this.answersRange[idx][i].min <= val && (this.answersRange[idx][i].max == '>' || this.answersRange[idx][i].max >= val)) {
					index = ++i;
					break;
				}
			}
			return (index != -1) ? index : false;
		},

		updateAnswerFn : function(e) {
			this.updateAnswer['answer' + (parseInt($(e.currentTarget).parents(".question-index").data("question")) + 1)] = parseInt($(e.currentTarget).parents(".q-option-index").data("answer")) + 1;
			console.log(this.updateAnswer);
		},

		// uodate questionair
		updateQuestionair : function(e) {
			e.preventDefault();
			var _self = this, count = 0;
			qModel = new questionairModel, updateAnswers = new updateAnswersModel;
			qModel.id = this.userId;

			// set update aswers
			updateAnswers.save(this.updateAnswer, {
				success : function() {
					count++;
					_self.goToBuyerPage(count);
				},
				error : function() {
					alert("Some error occured");
				}
			});

			// get questainair
			var questionair = $(e.target).find(".questionair").is(':checked');

			qModel.save({
				needQuestionnaire : questionair
			}, {
				success : function() {
					count++;
					_self.goToBuyerPage(count);
				},

				error : function() {
					alert("Some error occured");
				}
			});
		},

		// redirect to buyer page
		goToBuyerPage : function(count) {
			if (count == 2) {
				App.routing.navigate("buyer", {
					trigger : true
				});
			}
		},

		// main initialize function
		initialize : function(options) {
			this.userId = options.userDetail.id;
		},

		render : function() {
			this.$el.html(viewTemplate({
				questions : this.questions
			}));
		}
	});
});
