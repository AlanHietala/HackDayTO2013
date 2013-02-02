
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose')
  , UserModel = require('./models/usermodel').create()
  , routes = require('./routes') 
  , user = require('./routes/user')
  , sessions = require('./routes/sessions')
  , authMiddleware = require('./middleware/auth-middleware')
  , isLoggedIn = authMiddleware.isLoggedIn
  , andIsOwner = authMiddleware.andIsOwner
  , authUser = authMiddleware.authUser
  , mongoDBConnect = process.env.MONGOLAB_URI || 
                     process.env.MONGOHQ_URL || 
                     'mongodb://localhost/mydb'
  , app = express();


mongoose.connect(mongoDBConnect);  

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', isLoggedIn, routes.index);
app.get('/users/:id', isLoggedIn, andIsOwner, user.show);
app.get('/users', user.list);
app.get('/users/new', user.new);
app.post('/users/create', user.create);

app.get('/sessions/new', sessions.new);
app.post('/sessions/create', authUser, sessions.create);


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
