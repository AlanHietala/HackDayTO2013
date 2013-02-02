var mongoose = require('mongoose')
  , UserModel = mongoose.model('User');
/*
 * GET users listing.
 */

exports.list = function(req, res) {
  res.send("respond with a resource");
};

exports.show = function(req, res) {
	UserModel.findById(req.params.id, function(err, user) {
		res.render('users/show', {user: user, title: 'Show User'});
	});
	
};

exports.create = function(req, res) {
	var password = req.param('password')
	  , repeatPassword = req.param('repeat-password')
	  , email = req.param('email');

	if(password !== repeatPassword) {
		res.redirect('/password-nomatch');
	} else {

		var newUser = new UserModel({email:email, password: password});
		newUser.save(function(error, result) {
			if(error) {
				// handle the error
				res.render(error);
			} else {
				//redirect to the user's profile page
				req.session.currentUser = newUser;
				res.redirect('/users/' + result._id);
			}
		});
	}
};

exports.new = function(req, res) {
	res.render('users/new', {title: 'Login'});
};

exports.update = function(req, res) {

};