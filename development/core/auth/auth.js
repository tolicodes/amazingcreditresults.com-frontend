define([
	"auth/models/myself"
], function(
	authModel
){
	return {
		authorizeUser: function() {
			if (!this.user) {
				this.user = new authModel();
				this.user.fetchedDfd
					.fail(function() {
						App.Mediator.trigger("messaging:showAlert", "Authorization failed. Please login.", "Red");
						this.logoutUser();
					}.bind(this))
					.done(this.showUserName.bind(this));
			}

			return this.user.fetchedDfd;
		},

		getUser: function(){
			return this.user;
		},

		// logout
		logoutUser: function() {
			delete this.user;
			router.navigate("logout", { trigger: true });
		},

		showUserName: function() {
			if (this.user && this.user.get("name")) {
				var name = (this.user.get("name").givenName) ? 
					this.user.get("name").givenName : "-";
				name += " ";
				name += (this.user.get("name").familyName) ? this.user.get("name").familyName : "-";
				$(".username").html(name);
			}
		}
	}
})