// middleware
const path         = require('path');        // utilities for working with directory paths
const createError  = require('http-errors'); // error handling
const logger       = require('morgan');      // logs requests
const bodyParser   = require('body-parser'); // body parsing

// express
const express      = require('express');
const exphbs       = require('express-handlebars');

// sessions
const cookieParser = require('cookie-parser');
const session      = require('express-session')

// apis
const dotenv       = require('dotenv').config();
const passport     = require('./config/passport');

// routes
const indexRouter  = require('./routes/index');
const usersRouter  = require('./routes/users');
const giphyRouter  = require('./routes/giph');

var app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

// configure sessions
const session = require('express-session');
app.use(session({ secret: 'secret-unique-code', cookie: { maxAge: 3600000 }, resave: true, saveUninitialized: true }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// middleware activation
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// routers
app.use('/',      indexRouter);
app.use('/users', usersRouter);
app.use('/giph',  giphyRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// database
const mongoose = require('mongoose');
const mongoURI = 'mongodb://heroku_vlsvp8vn:q99pjbjlqtaa2bglj2uu2ho03b@ds115595.mlab.com:15595/heroku_vlsvp8vn'

mongoose.connect(mongoURI)
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

require("./routes/api.js")(app);

module.exports = app;