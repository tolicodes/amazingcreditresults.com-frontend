// list.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base",
	"hbs!../templates/import",
	"../models/import",
	"jqueryUpload",
	"jqueryUploadIframe",
	"css!libs/blueimp-file-upload/css/jquery.fileupload",
	"css!libs/blueimp-file-upload/css/jquery.fileupload-ui"
	], function(
	Base,
	viewTemplate,
	importBuyer
	) {

	return Base.extend({
		
		tpl: viewTemplate,

		el: undefined,
		
		initializeAfter: function() {
			this.$el.find("#fileupload").fileupload({
				url: this.getUrl("importBuyer"),
		        dataType: 'json',
				done: function (e, data) {
		            $.each(data.files, function (index, file) {
		                $('<p/>').text(file.name).appendTo('#files');
		            });
		        },
		        progressall: function (e, data) {
		            var progress = parseInt(data.loaded / data.total * 100, 10);
		            this.$el.find('#progress .progress-bar').css(
		                'width',
		                progress + '%'
		            );
		        }.bind(this)    		
		     });
		}
	});
});
