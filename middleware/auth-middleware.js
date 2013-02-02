var mongoose = require('mongoose')
  , UserModel = mongoose.model('User');

exports.authUser = function(req, res, next) {
	UserModel.findOne({email:req.param('email')}, function(error, user) {
        if(error) {
          next(error);
        } else {
          if(user) {
            user.verifyPasswordCorrect(req.param('password'), function(error, isValid) {
                if(error) {
                  next(error);
                } else if(isValid) {

					req.session.currentUser = user;
					next();
				       
                } else {
                  next(new Error('Invalid Password'));
                }
                
            });
          } else {
            next();
          }
        }
      });  
}

exports.isLoggedIn = function(req, res, next) {
	if(!req.session.currentUser) {
		res.redirect('/sessions/new');
	} else {
		next();
	}
}

exports.andIsOwner = function(req, res, next) {
	if(req.params.id) {
		console.log(req.session.currentUser._id)
        if(req.session.currentUser && req.params.id === req.session.currentUser._id) {
          req.isOwner = true;
          next();
        } else {
          next(new Error("Unauthorized Access"));
        }
       
	} else {
		next(new Error("Cant verify ownership, resource not ownable"));
	}
}