define([
	'core/data-table/action-buttons-cell',
	'./send-welcome-email-model',
	'./reset-password-model'
], function(
	ActionButtonsCell,
	SendWelcomeEmailModel,
	ResetPasswordModel
) {
	return ActionButtonsCell.extend({
		resourceName: 'user',

		buttons: {
			'resend-email': {
				label: 'Send Welcome Email',
				icon: 'glyphicon glyphicon-envelope',
				onClick: 'resendEmail'
			},
			'reset-password': {
				label: 'Reset Password',
				icon: 'glyphicon glyphicon-lock',
				onClick: 'resetPassword'
			},
			'deactivate': {
				label: 'Deactivate',
				icon: 'glyphicon glyphicon-minus',
				onClick: 'deactivate'
			},
			'activate btn-primary': {
				label: 'Activate',
				icon: 'glyphicon glyphicon-plus',
				onClick: 'activate'
			}
		},

		resendEmail: function(){
			var model = new SendWelcomeEmailModel({
				userId: this.model.get('id')
			});

			model.save();
		},

		resetPassword: function(){
			var model = new ResetPasswordModel({
				userId: this.model.get('id')
			});

			model.save();
		},

		activate: function() {
			this.model.save({isBanned: false});
			this._configureActivateButtons();
		},

		deactivate: function(){
			this.model.save({isBanned: true});
			this._configureActivateButtons();
		},

		_configureActivateButtons: function(){
			var banned = this.model.get('isBanned');

			this.$('.activate, .deactivate').show();
			if(banned) {
				this.$('.deactivate').hide();

			} else {
				this.$('.activate').hide();
			};
		},

		_configureWelcomeEmailButton: function(){
			if(this.model.get('roles.owner')) {
				this.$('.resend-email').hide();
			}
		},
		
		render: function() {
			ActionButtonsCell.prototype.render.apply(this, arguments);
			this._configureActivateButtons();
			this._configureWelcomeEmailButton();

			return this;
		}
	});
})