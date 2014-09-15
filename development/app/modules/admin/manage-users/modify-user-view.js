define([
	'core/mvc/view'
], function(
	View
){
	return View.extend({		
		hooks: {
			'initialize:before': ['checkUserModel'],
			'M:edit-user': ['editUser']
		},

		editUser: function(model){
			this.model = model;

			var editView = new this.views['.general-info']({
				templateData: {
					submitButton: 'Edit User'
				}
			});

			this.trigger('insertEditView:before', editView);

			this.addView(editView, '.general-info');
		},

		checkUserModel: function(){
			if(!this.model) {
				this.model = new this.UserModel();
				this.listenTo(this.model, 'sync', this.addToList);
			}
		},
		addToList: function(model) {
			this.parentView._views['.list'].collection.add(model)
		}
	});
});