const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const passport = require('passport');

const app = express();

const indexRouter = require('./routes/index');
require('./routes/users')(passport);

app.set('views', path.join(__dirname, 'views'));//указываем папку с шаблонами
app.set('view engine', 'pug');//задаем значение движка - pug

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'hgjfdfr',
  resave: false,
  saveUninitialized: false
}));

require('./public/javascripts/passport-config')
app.use(passport.initialize());
app.use(passport.session());

app.use('/library/books',require('./routes/books').router);
app.use('/', indexRouter);
app.use('/users', require('./routes/users').router);
module.exports = app;
