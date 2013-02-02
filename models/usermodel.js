var bcrypt = require('bcrypt')
  , mongoose = require('mongoose')
  , Schema = mongoose.Schema;

function generateRandomAlphaNumeric(numGen){
	var idChars = "1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var numChars = numGen;
	
	var randomId = "";
	while(numChars){
		var rnum = Math.floor(Math.random() * idChars.length);
		randomId += idChars.substring(rnum,rnum+1);
		numChars --;
	}
	
	return randomId;
};

function createBcryptHash(password){
	var salt = bcrypt.genSaltSync(10);

	return bcrypt.hashSync(password, salt);
				
};

function create(){
	
    UserSchema = new Schema({
      email        : {type: String, index : { unique: true}},
      passwordHash : String,
      resetGuid	   : String
    });


    UserSchema.methods.resetPassword = function resetPassword(resetGuid, newPassword, callback) {
		if(resetGuid === this.resetGuid){
			var hash = createBcryptHash(newPassword);
			this.passwordHash = hash;
			this.resetGuid = null;
			this.save(callback);
		}else{
			callback(new Error("resetGuid did not match"));
		}
	};

	UserSchema.methods.createResetGuid = function(callback) {
			var guid = generateRandomAlphaNumeric(12);
			this.resetGuid = guid;
			this.save(function(error) {
				if(error) {
					callback(error);
				} else {
					callback(null, guid);
				}
			})
	};
	
	
	UserSchema.virtual('password').set(function(password) {
		
		var hash = createBcryptHash(password);
		this.passwordHash = hash;
		
		
	});

	UserSchema.methods.verifyPasswordCorrect = function(password, callback) {
		var hash = this.passwordHash;
		bcrypt.compare(password, hash, callback);		
	}

    mongoose.model('User', UserSchema);
    return mongoose.model('User');


}

exports.create = create;