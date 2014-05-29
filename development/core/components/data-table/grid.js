// data-table.js
// --------------
// Requires define
// Return Backbone View {Object}

define([
	"base", 
	"backbone",
	"backgrid", 
	"pageableCollection", 
	"backgridPaginator",
	"hbs!core/components/data-table/templates/grid",
	"css!libs/backbone-pageable/examples/css/backgrid",
	"css!libs/backgrid-paginator/backgrid-paginator"
], function(
	Base, 
	Backbone,
	Backgrid, 
	PageableCollection, 
	BackgridPaginator, 
	viewTemplate
) {
	return Base.extend({

		tpl: viewTemplate,

		parse: function(result) { 
			return result; 
		},
		
		addResetButton: function(resetPasswordModel) {
			var ResetButtonCell = Backgrid.ResetButtonCell = Backbone.View.extend({
			    template: _.template("<button>Reset password</button>"),
			    events: {
			      "click": "resetPassword"
			    },
			    
			    tagName: 'td',
			    
			    className: "boolean-cell renderable",
			    
			    initialize: function(options) {
			    	console.log(options.model.get("id"));
			    	if(options.model) {
				    	this.model = new resetPasswordModel();
				    	this.model.userId = options.model.get("id");
				    }
			    },
			    
			    resetPassword: function (e) {
			      e.preventDefault();
				  this.model.save();
			    },
			    
			    render: function () {
			      this.$el.html(this.template());
			      this.delegateEvents();
			      return this;
			    }
			});
		},

		welcomeEmailButton: function(welcomeEmailModel) {
			var WelcomeEmailCell = Backgrid.WelcomeEmailCell = Backbone.View.extend({
			    template: _.template("<button>Send Welcome Email</button>"),
			    events: {
			      "click": "welcomeEmail"
			    },
			    
			    tagName: 'td',
			    className: "boolean-cell renderable",
			    
			    initialize: function(options) {
			    	console.log(options.model.get("id"));
			    	if(options.model) {
				    	this.model = new welcomeEmailModel();
				    	this.model.userId = options.model.get("id");
				    }
			    },
			    
			    welcomeEmail: function (e) {
			      e.preventDefault();
				  this.model.save();
			    },
			    
			    render: function () {
			      this.$el.html(this.template());
			      this.delegateEvents();
			      return this;
			    }
			});
		},



		generateTable: function() {
			var Rows = Backbone.PageableCollection.extend({
				url : this.url || "",
				mode : this.mode || "client",
				parse: this.parse,
				state: {
    				pageSize: this.pageSize || 5
    			}
			}), rows = new Rows(), grid = new Backgrid.Grid({
				columns : this.columns || {},
				collection : rows
			}), paginator = new Backgrid.Extension.Paginator({
				collection : rows
			});

			this.$el.find("#grid").html(grid.render().$el);
			this.$el.find("#paginator").html(paginator.render().$el);
			
			if(this.collection) {
				this.listenTo(this.collection, 'sync', function(){
					var data  = this.collection.toJSON();
					for(var i in data) {
						rows.add(data[i]);		
					}
				}.bind(this));
				this.collection.fetch();
			} else {
				rows.fetch();
			}
		},

		afterRender: function() {
			setTimeout(this.generateTable(), 100);
		}
	});
});
