define([
], function(

){
	return {
		// user activity time in minutes
		logoutTime: 5,
		
		init: function(){
			if (this.isLocalhost()) {
				return;
			}

			this.userActivityLastTime = new Date().getTime();
			$("html").bind('mousemove click', function() {
				this.userActivityLastTime = new Date().getTime();
			}.bind(this));

			// bind interval to check user activity
			setInterval(this.calculateActivityTime.bind(this), 60000);
		},

		isLocalhost: function() {
			return window.location.hostname === 'localhost';
		},

		calculateActivityTime: function() {
			if (sessionStorage.getItem("huntKey")) {
				var diff = new Date().getTime() - this.userActivityLastTime,
					minutes = Math.floor((diff / 1000) / 60);

				if (minutes >= (this.logoutTime - 1)) {
					userActivityLastTime = new Date().getTime();
					this.logoutUser();
				}
			}
		},

		// logout
		logoutUser: function() {
			router.navigate("logout", { trigger: true });
		}
	};
});