define([
	"Popup",
	 "common/views/time-out/views/time-out"
], function(
  PopupView,
  timeOutView
){
	return {
		// user activity time in minutes
		logoutTime: 3,
		init: function(){
			if (this.isLocalhost()) {
				return;
			}

			this.userActivityLastTime = new Date().getTime();
			$("html").bind('mousemove click', function(e) {
				if(!this.timerRunning)
					this.userActivityLastTime = new Date().getTime();
				
				if(e.type == "click")
					$(".refresh-session-outer").addClass("hide");
			}.bind(this));

			setTimeout(function() {
				
			
			App.routing.off("resetActivityTimer");
			App.routing.on("resetActivityTimer", this.resetActivityTime.bind(this));
}.bind(this), 2000);

			// bind interval to check user activity
			setInterval(this.calculateActivityTime.bind(this), 60000);
		},
		
		resetActivityTime : function() {
			this.userActivityLastTime = new Date().getTime();
			this.timerRunning = false;
		},		

		isLocalhost: function() {
			return false;
			//return window.location.hostname === 'localhost';
		},

		calculateActivityTime: function() {
			if (sessionStorage.getItem("huntKey")) {
				var diff = new Date().getTime() - this.userActivityLastTime,
					minutes = Math.floor((diff / 1000) / 60);

				console.log(minutes, (this.logoutTime - 1));

				if (minutes >= (this.logoutTime - 1)) {
					userActivityLastTime = new Date().getTime();
					this.logoutUser();
						if(this.popup)
							this.popup.closePopup();
				} else if (minutes >= (this.logoutTime - 2)) {
					this.popup = new PopupView({view: timeOutView, methodToCall: 'showTimerHTML'});
				} else if (window.location.hash.match("setPassword") && (minutes >= (this.logoutTime - 3))) {
					this.popup = new PopupView({view: timeOutView, methodToCall: 'showSetPasswordTimerHTML'});
				}

			}
		},

		// logout
		logoutUser: function() {
			App.routing.navigate("logout", { trigger: true });
		}
	};
});