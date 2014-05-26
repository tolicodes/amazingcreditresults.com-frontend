// home.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"hbs!questionnaire/templates/questionair", 
	"questionnaire/models/questionnaire", 
	"questionnaire/models/update-answers",
	"questionnaire/models/questions"
], function(
	Base, 
	viewTemplate, 
	questionairModel, 
	updateAnswersModel,
	questionModel
) {

	return Base.extend({

		tpl: viewTemplate,

		extraHooks: {
			'intialize:before' : ['setQuestions']
		},

		events : {
			'submit .find-trade-form' : 'updateQuestionair',
			'click .questainair-options' : 'updateAnswerFn',
			'keyup .total-dept' : 'updateAmount',
			'keyup .anual-income' : 'updateAmount'
		},

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
			cal = dept / annual;
			this.$el.find(".result").html(cal);
			this.updateAnswer['answer' + index] = this.getTheRange(cal, index);
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
		},

		// uodate questionair
		updateQuestionair : function(e) {
			e.preventDefault();
			var updateAnswers = new updateAnswersModel,
			questionair = $(e.target).find(".questionair").prop('checked');

			this.listenTo(updateAnswers, 'sync', function(){
				this.goToBuyerPage();
			}.bind(this));
			
			this.listenTo(updateAnswers, 'error', function(){
				App.Mediator.trigger("messaging:showAlert", "Some error occured", "Red");
			});
			
			updateAnswers.set(this.updateAnswer);	
			updateAnswers.set({needQuestionnaire : questionair});
			updateAnswers.save();
		},

		// redirect to buyer page
		goToBuyerPage : function(count) {
			App.routing.navigate("buyer", {
				trigger : true
			});
		},
		

		setQuestions : function(options) {
			
			if(options && options[0])
				this.userId = options[0].userDetail.id;
			this.model = new questionModel();
			
			this.data.questions = [{
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
		}];
		}

	});
});
