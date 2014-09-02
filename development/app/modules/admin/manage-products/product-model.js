define([
	'core/mvc/model',
], function(
	Model
) {
	return Model.extend({
		url: 'manageProduct',
		
		schema: {
			'bank': 'Text',
			'name': 'Text',
			'type': 'Text',
			'notes': 'Text'
		},

		validation: {

		}
	});
})