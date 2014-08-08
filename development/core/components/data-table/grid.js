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
	"cart/models/create",
	"css!libs/backbone.paginator/examples/css/backgrid",
	"css!libs/backgrid-paginator/backgrid-paginator"
], function(
	Base, 
	Backbone,
	Backgrid, 
	PageableCollection, 
	BackgridPaginator, 
	BackgridSelect,
	viewTemplate,
	createCartModel
) {
	var DataTable = Base.extend({

		tpl: viewTemplate,

		parse: function(result) { 
			return result; 
		},

		extraHooks: {
			'addActionItems': ['addActionItems'],
			'updateCart' : ['updateListView']
		},
		
		addActionItems: function() {
			this.addActionButton();
		},
		
		selectedRows: [],
		
		// add action button
		addActionButton: function() {
			var _self = this, ActionButtonCell = Backgrid.ActionButtonCell = Backbone.View.extend({
			    template: _.template("<button><%=buttonText%></button>"),
			    events: {
			      "click": "clickAction"
			    },
			    
			    tagName: 'td',
			    
			    className: "boolean-cell renderable",
			    
			    initialize: function(options) {
			    	if(options) {
			    		this.model = options.model;
				    	this.userId = options.model.get("id");
				    	this.buttonText = options.column.get("label") || options.column.get("name");
				    	this.callback = options.column.get("callback");
				    	this.actionType = options.column.get("actionType");
				    }
			    },
			    
			    clickAction: function (e) {
			      e.preventDefault();
				  	if(this.actionType == "delete" && confirm("Are you sure?")) {
				  		_self.deleteRecord(this.model, false, function() {
				  			App.routing.trigger("refreshTradelines");
				  		});
				  	} else if(this.actionType == "addItemInCart") {
						// disable button
						this.$el.find("button").prop("disabled", true);		  		
					  	if(_self.addItemToCart && _.isFunction(_self.addItemToCart)) {
					  		_self.addItemToCart(this.userId);
						}
				  	} else {
					  	if(this.callback && _.isFunction(this.callback)) {
					  		this.callback(this.userId);	
					  	}			  		
				  	}
			    },
			    
			    render: function () {
			      this.$el.html(this.template({buttonText: this.buttonText}));
			      
			      if(this.actionType == "addItemInCart") {
			      	this.$el.find("button").prop("disabled", (this.model.get("inCart"))?true: false);
			      }
			      
			      this.delegateEvents();
			      return this;
			    }
			});
		},

		addItemToCart: function(id) {
			var cart = new createCartModel();
			this.listenTo(cart, 'sync', function(response) {
				// add to cart
				App.Mediator.trigger("messaging:showAlert", "Item Added to cart successfully.", "Green");
				App.routing.trigger("addItemToCart", response);
			}.bind(this));
			cart.save({id: id});			
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
		
		refreshList: function() {
			this.generateTable();
			//if(this.collection)
			//	this.collection.fetch({reset: true});
			//else		
			//	this.rows.fetch({reset: true});
		},

		generateTable: function() {
			
			var url = (this.url && _.isFunction(this.url))?this.url():this.url,
			Rows = Backbone.PageableCollection.extend({
				url : url || "",
				mode : this.mode || "client",
				parse: this.parse,
				state: {
    				pageSize: this.pageSize || 5
    			}
			});
			
			this.rows = new Rows();
			var paginator = new Backgrid.Extension.Paginator({
				collection : this.rows
			});
			
			this.grid = new Backgrid.Grid({
				columns : this.columns || {},
				collection : this.rows,
				emptyText: this.emptyText || "No Record Found."
			});
			
			this.$el.find(".grid").html(this.grid.render().$el);
			this.$el.find(".paginator").html(paginator.render().$el);
			
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
				this.collection.fetch({reset: true});
			} else {
				this.rows.on("backgrid:selected", function (model, selected) {
  					this.selectedRows.push(model);
				}.bind(this));
				this.rows.fetch({reset: true});
			}
		},
		
		// delete single record
		deleteRecord: function(model, silent, callback) {
			this.listenTo(model, 'sync', function() {
				App.Mediator.trigger("messaging:showAlert", "Record deleted successfully.", "Green");
				if(callback && _.isFunction(callback)) callback();
			}.bind(this));
			
			this.listenTo(model, 'error', function(model, response) {
				var json = (response.responseText)?JSON.parse(response.responseText):{};
				App.Mediator.trigger("messaging:showAlert", json.Error, "Red", json.errors);
			});
			model.destroy({wait: true});
		},
		
		// delete multiple records
		deleteRecords: function() {
			_.each(this.selectedRows, function( model ) {
				this.deleteRecord(model, true);
			}.bind(this));
		},

		afterRender: function() {
			setTimeout(this.generateTable(), 400);
		}
	});

  DataTable.alignedHeaderCell = function(alignment) {
    return Backgrid.HeaderCell.extend({
      tagName: 'th style="text-align: ' + alignment + '"'
    });
  };

  return DataTable;
});
