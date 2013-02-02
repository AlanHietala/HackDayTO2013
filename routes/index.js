
/*
 * GET home page.
 */

exports.index = function(req, res){
  	req.redirect('/users/' + req.session.currentUser._id);
};