let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let bP = require('body-parser');
let logger = require('morgan');
const Rollbar = require('rollbar');
const request = require('./request');
const rollbar = new Rollbar({
  accessToken: '97a69fce24cf448db27f89abf47bc805'
});

request();


let indexRouter = require('./routes/index');
let adminRouter = require('./routes/admin');
let usersRouter = require('./routes/users');
let app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin',adminRouter);
app.use('/users',usersRouter);


module.exports = app;

