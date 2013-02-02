var mongoose = require('mongoose')
  , FridgeItemModel = mongoose.model('FridgeItem');
exports.show = function(req, res) {
	res.render('fridge/show.jade', {title: 'fridge'});
};
exports.getFridges = function(req, res) {
	FridgeItemModel.find({}, function(err, fridgeItems) {
		if(err) res.send({error: 'error'});
		else {
			res.send(fridgeItems);
		}
	});
};
exports.getFridgeItem = function(req, res) {
	console.log(req.params);
};

exports.deleteFridgeItem = function(req, res) {
	FridgeItemModel.findById(req.params.id).remove(function(error){
		res.send({ok:'ok'});
	});
};
exports.updateFridgeItem = function(req, res) {
	FridgeItemModel.findById(req.params.id, function(err, model) {
		if(err) res.send(err);
		else {
			model.name = req.param('name');
			model.quantity = req.param('quantity');
			model.save(function(err) {
				res.send({ok:'ok'});
			})
		}
	});
};
exports.createFridgeItem = function(req, res) {
	var newItem  = new FridgeItemModel({name: req.param('name'),
										quantity: req.param('quantity')});

	newItem.save(function(error) {
		if(error) res.send(error);
		else {
			res.send(newItem.toJSON());
		}
	});
};