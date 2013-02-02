
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

function create() {
	
    var FridgeItemSchema = new Schema({
      userId: String,
      name: String,
      quantity: Number

    });
    FridgeItemSchema.virtual.id = function() {
    	return this.id;
    };
    FridgeItemSchema.set('toJSON', { getters: true, virtuals: true });
    mongoose.model('FridgeItem', FridgeItemSchema);
    return mongoose.model('FridgeItem');


}

exports.create = create;