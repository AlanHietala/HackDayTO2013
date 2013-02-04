
var fridge = {
	settings: {
		server : 'http://localhost:5000',
		userId: 1
	},
	views: {},
	collections:{}
};


var FridgeItem = Backbone.Model.extend({
});

var Fridge = Backbone.Collection.extend({
  model: FridgeItem,
  url: 'users/' + fridge.settings.userId + '/fridge'

});

var AddItemView = Backbone.View.extend({
	el:'#add-item',
	events: {
		'click #add-button': 'addItem'
	},
	render: function() {

	},
	initialize: function() {

	},
	addItem: function() {
		console.log('add item clicked')
		var itemToAdd = $('#add-input').val();
		fridge.fridgeCollection.create({
			name: itemToAdd,
			quantity: 0
		});
	}
});
var loginView = Backbone.View.extend({
	el: '#login-pane',
	events: {
		'click .login': 'doLogin'
	},
	render: function() {
		return this;
	},
	initialize: function() {

	},
	doLogin: function() {
		var that = this;
		$.ajax({
				data: object,
				dataType: 'json',
				error: function(req, stat, err) {
                    
                },
				success: function(data, stat, req) {
					that.loginSuccess(data);
				},
				type: 'POST',
				url: fridge.settings.server + "/sessions/new"
			});
	},
	loginSuccess: function(data) {
		fridge.settings.token = data.token;
	},
	loginFailure: function() {

	}
});
var FridgeView = Backbone.View.extend({
	el: '#fridge-list',
	render: function() {
		return this;
	},
	childViews: [],
	initialize: function() {
		var that = this;
		fridge.fridgeCollection = new Fridge();

		fridge.fridgeCollection.on('sync', function(model) {
			_.each(that.childViews, function(view) {
				view.remove();
			});

			fridge.fridgeCollection.each(function(model) {
				var childFridgeItemView = new FridgeItemView({model: model});
				that.childViews.push(childFridgeItemView);
				that.$el.append(childFridgeItemView.render().el);
			})
			
		});

		fridge.fridgeCollection.fetch({update: true, remove: false});
		fridge.views.addItemView = new AddItemView();

	},
	addFridgeItem: function(fridgeItem) {
		
	}
});

var FridgeItemView = Backbone.View.extend({
	className: 'fridge-item',
	tagName: 'li',
	events: {
		'click .high': 'changeQuantityHigh',
		'click .med': 'changeQuantityMed',
		'click .low': 'changeQuantityLow',
		'click .delete': 'deleteItem'
	},
	render: function() {
		this.$el.append(this.template({name: this.model.get('name'),quantity:this.model.get('quantity')}));
		return this;
	},
	initialize: function() {
		this.template = _.template($('#fridge-item-template').html());
		//this.listenTo(this.model, "change", this.render);
	},
	deleteItem: function() {
		var a = this.model.destroy();
		this.remove();
	},
	resetGrey: function() {
		this.$('.btn')
			.removeClass('btn-warning')
			.removeClass('btn-success')
			.removeClass('btn-danger');
	},
	changeQuantityHigh: function() {
		this.resetGrey();
		this.$('.high').addClass('btn-success');
		this.setQuantity(2);
	},
	changeQuantityMed: function() {
		this.resetGrey();
		this.$('.med').addClass('btn-warning');
		this.setQuantity(1);
	},
	changeQuantityLow: function() {
		this.resetGrey();
		this.$('.low').addClass('btn-danger');
		this.setQuantity(0);
	},
	setQuantity: function(value) {
		this.model.set('quantity', value);
		this.model.save();
	}
});

$(function() {
	var mainApp = new FridgeView();
	mainApp.render();
});