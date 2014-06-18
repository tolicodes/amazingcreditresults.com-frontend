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
	"backgridSelect",
	"hbs!core/components/data-table/templates/grid",
	"css!libs/backbone-pageable/examples/css/backgrid",
	"css!libs/backgrid-paginator/backgrid-paginator"
], function(
	Base, 
	Backbone,
	Backgrid, 
	PageableCollection, 
	BackgridPaginator, 
	BackgridSelect,
	viewTemplate
) {
	return Base.extend({

		tpl: viewTemplate,

		parse: function(result) { 
			return result; 
		},
		
		selectedRows: [],
		
		// add action button
		addActionButton: function() {
			var ActionButtonCell = Backgrid.ActionButtonCell = Backbone.View.extend({
			    template: _.template("<button><%=buttonText%></button>"),
			    events: {
			      "click": "editRecord"
			    },
			    
			    tagName: 'td',
			    
			    className: "boolean-cell renderable",
			    
			    initialize: function(options) {
			    	console.log(options);
			    	if(options) {
				    	this.userId = options.model.get("id");
				    	this.buttonText = options.column.get("name");
				    	this.callback = options.column.get("callback");
				    }
			    },
			    
			    editRecord: function (e) {
			      e.preventDefault();
				  if(this.callback && _.isFunction(this.callback)) this.callback(this.userId);
			    },
			    
			    render: function () {
			      this.$el.html(this.template({buttonText: this.buttonText}));
			      this.delegateEvents();
			      return this;
			    }
			});
		},
		
		addCheckbox: function() {
			var BooleanCell = Backgrid.BooleanCell = Backbone.View.extend({
			  className: "boolean-cell",
			  
			  tagName: 'td',
			  className: "boolean-cell renderable",
			 // editor: BooleanCellEditor,
			  events: {
			      "click": "enterEditMode",
			      "click input": "inputClick"
			  },
			  
			  initialize: function(options) {
			  	if(options) {
			  		this.column = options.column;
			  		this.model = options.model;
			  		this.getValue = options.column.get("getValue");
			  	}
			  },

			  render: function () {
			    this.$el.empty();
			    var val = (this.getValue && this.getValue(this.model)) || undefined;
			    this.$el.append($("<input>", {
			      tabIndex: -1,
			      type: "checkbox",
			      checked: val || this.model.get(this.column.get("name"))
			    }));
			    this.delegateEvents();
			    return this;
			  },
			
			  inputClick: function (event) {
			      console.log(this.column.get("model"));
			      var attributes = {},
			      m = eval(this.column.get("model")),
			      model = new m(), ob = {};
			      attributes[this.column.get("name")] = $(event.target).prop("checked");
			      this.model.set(attributes);
			      
			      model.id = this.model.get("id");
			      ob[this.column.get("name")] = $(event.target).prop("checked");
			      ob["id"] = this.model.get("id");
			      model.save(ob);
			  }
			
			});
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
				
				this.collection.on("backgrid:selected", function (model, selected) {
  					this.selectedRows.push(model);
				}.bind(this));
				
				this.listenTo(this.collection, 'sync', function(){
					var data  = this.collection.toJSON();
					for(var i in data) {
						rows.add(data[i]);
					}
				}.bind(this));
				this.collection.fetch();
			} else {
				rows.on("backgrid:selected", function (model, selected) {
  					this.selectedRows.push(model);
				}.bind(this));
				rows.fetch();
			}
		},
		
		// delete records
		deleteRecords: function() {
			_.each(this.selectedRows, function( model ) {
				this.listenTo(model, 'sync', function() {
					App.Mediator.trigger("messaging:showAlert", "Record deleted successfully.", "Green");
				});
				this.listenTo(model, 'error', function(model, response) {
					var json = (response.responseText)?JSON.parse(response.responseText):{};
					App.Mediator.trigger("messaging:showAlert", json.Error, "Red", json.errors);
				});
				model.destroy({silent: true});
			}.bind(this));
		},

		afterRender: function() {
			setTimeout(this.generateTable(), 100);
		}
	});
});
