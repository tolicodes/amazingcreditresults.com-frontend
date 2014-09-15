define([
	"core/modal/modal",
	'./innerModal'
], function(
	Modal,
	innerModal
){
	return Modal.extend({
		options: {
			inactivityTimeout: 5 * 60 * 1000,
			warningTimeout: 4 * 60 * 1000,
			showClose: false,
			showSave: false,
			modalTitle: 'Inactivity Timeout'
		},

		started: false,

		hooks: {
			'initialize:before': 'listenToTriggers'
		},

		mainView: innerModal,

		className: 'inactivity-timeout-modal',

		listenToTriggers: function(){
			var startTrigger = this.options.startTrigger,
				stopTrigger = this.options.stopTrigger;

			this.listenTo(startTrigger[0], startTrigger[1], this.start);
			this.listenTo(stopTrigger[0], stopTrigger[1], this.stop);
		},

		start: function(){
			if(this.started) { return; }
			this.enableActivityTracking();
			this.startCounters();
		},

		stop: function(){
			if(!this.started) { return; }
			this.disableActivityTracking();
			this.stopCounters();
		},

		startCounters: function(){
			_.bindAll(this, 'triggerInactivityTimeout', 'show');

			this.inactivityCounter = setTimeout(this.triggerInactivityTimeout, this.options.inactivityTimeout)
			this.warningCounter = setTimeout(this.show, this.options.warningTimeout);
		},

		stopCounters: function(){
			clearTimeout(this.inactivityCounter);
			clearTimeout(this.warningCounter);

			if(this._showing) {
				this.hide();
			}
		},

		resetCounters: function(){
			this.stopCounters();
			this.startCounters();
		},
		
		enableActivityTracking: function(){
			this.lastActivity = new Date().getTime();

			_(this).bindAll('onActivity');
			
			$("html").on('mousemove click', this.onActivity);
		},

		disableActivityTracking: function(){
			$('html').off('mousemove click', this.onActivity);
		},

		onActivity: function() {
			this.lastActivity = new Date().getTime();
			this.resetCounters();
		},

		triggerInactivityTimeout: function(){
			this.Mediator.trigger('inactivityTimeout');
			this.hide();
		}
	});
})