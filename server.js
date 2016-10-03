var express = require("express");
//app is our web server.
//express is the software that creates our framework
//Setting up core functionality of the web server
var app = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

//Importing middleware (on every request we get, these operate to "do something")
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');


var configDB = require('./config/database.js');
mongoose.connect(configDB.url)

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
require('./config/passport')(passport); // pass passport for configuration
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

app.listen(port);
