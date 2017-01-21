var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./configs/config.json');
var app = express();
var cors = require('cors');

var articleRoutes = require('./routes/articles');
var userRoutes = require('./routes/users');
var loginRoutes = require('./routes/login');

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${config.mongo.user}:${config.mongo.password}@ds119368.mlab.com:19368/heroku_05mx4t7b`, function(err) {
    if(err) {
        console.log(err);
    }
    console.log('Successfully connect to MongoDB');
} );

app.use(cors( {
    origin: 'http://localhost:3000',
	credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static('./public'));

app.use(session({
    secret: config.secret,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/articles', require('./routes/articles').index);
app.use('/users', require('./routes/users').index);
app.use('/', require('./routes/login').index);

app.use(function(req, res, next) {
	var err = new Error('Not found');
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next){
	res.status(res.status >= 100 && res.status < 600 ? err.code : 500);
	res.send();
});

app.listen(config.port, function() {
    console.log(`listening on port ${config.port}`)
});