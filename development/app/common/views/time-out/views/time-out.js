// list.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base",
	"hbs!../templates/time-out"
], function(
	Base,
	viewTemplate
	) {

	return Base.extend({
		
		tpl: viewTemplate,

		el: undefined,
		
		data: {},
		
		events: {
			"click .refresh-session": "refreshSession",
			"click .return-to-app": "refreshSession"
		},
		
		refreshSession: function() {
			App.routing.trigger("resetActivityTimer");
			this.closePopup();
			
		},
		
		timerRunning: false,

		closePopup: function() {
			$('.modal').modal('hide');
		},
		
		
		showSetPasswordTimerHTML: function() {
			if(!this.timerRunning) {
				this.timerRunning = true;
				var start = 119;
				this.closePopup();
				this.$el.find(".timeout-links").hide();
				this.$el.find(".return-to-app").show();
				var timer = setInterval(function() {
					this.$el.find(".countdown-time").html(start + " seconds");
					start--;
					if(start <= 0) {
						this.timerRunning = false;
						clearInterval(timer);
					}
				}.bind(this), 1000);
			}			
		},
		
		showTimerHTML: function() {
			if(!this.timerRunning) {			
				this.timerRunning = true;
				var start = 59;
				
				this.closePopup();
				this.$el.find(".timeout-links").hide();
				this.$el.find(".refresh-session").show();
				var timer = setInterval(function() {
					this.$el.find(".countdown-time").html(start + " seconds");
					start--;
					if(start <= 0) {
						this.timerRunning = false;
						clearInterval(timer);
					}
				}.bind(this), 1000);
			}
		},

		
		initializeBefore: function() {
		},
		
		initializeAfter: function() {
			
		}
	});
});
