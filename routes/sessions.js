exports.new = function(req, res){
    res.render('sessions/new.jade',{title: "login"});
};

exports.create = function(req, res){
    if(req.session.currentUser){
      res.redirect('/users/' + req.session.currentUser.id);
    } else { 
      res.render('sessions/new.jade',{title: 'login', flash : 'User or password incorrect'});
    }
}