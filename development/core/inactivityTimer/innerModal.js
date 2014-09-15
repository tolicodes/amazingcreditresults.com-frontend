define([
	'core/mvc/view',
	'hbs!./innerModal',
	'moment-duration-format'
], function(
	view,
	tpl
){

	return view.extend({
		tpl: tpl,
		hooks: {
			'append:after': ['startClock'],
			'close:before': ['stopClock']
		},

		startClock: function(){
			_(this).bindAll('decrementClock')
			this.clock = setInterval(this.decrementClock, 1000);
		},

		stopClock: function(){
			clearInterval(this.clock);
		},

		decrementClock: function(){
			var inactivityTimeout = this.parentView.options.inactivityTimeout,
				lastActivity = this.parentView.lastActivity,
				timeLeft =  (lastActivity + inactivityTimeout) - new Date().getTime();

			this.$('.clock').text(moment.duration(timeLeft).format('mm:ss', {trim:false})) ;
		}
	});
})