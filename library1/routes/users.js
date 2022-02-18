const express = require("express");
const router = express.Router()

module.exports=function (passport) {

     let wrongPass = false;
     let wrongName = false;

     router.get('/login', (req, res) => {
         if (req.isAuthenticated()) {
             res.render('authorized', {name: req.user.login,is_authorized:req.isAuthenticated()});
         } else {
             res.render('index', {title: 'library', wrongPass: wrongPass,is_authorized:req.isAuthenticated(),login:true});
             wrongPass = false;
         }
     })

     router.get('/signup', (req, res) => {
         if(req.isAuthenticated()){
             res.render('authorized',{name:req.user.login,is_authorized:req.isAuthenticated()})
         }else {
             res.render('signup', {wrongName: wrongName,is_authorized:req.isAuthenticated(),login:false})
             wrongName = false;
         }
     })

//обработка входа пользователя
     router.post('/login', (req, res, next) => {
         passport.authenticate('logIn',
             function (err, user) {
                 if (err) {
                     throw err;
                 }
                 if (!user) {
                     wrongPass = true;
                     return res.redirect('/users/login');
                 }
                 req.logIn(user, function (err) {
                     if (err) {
                         throw err;
                     }
                     return res.redirect('../library');
                 });
             })(req, res, next);
     });

//обработка регистрации пользователя
     router.post('/signup', (req, res, next) => {
          passport.authenticate('signup',
             function (err, user) {
                 if (err) {
                     throw err;
                 }
                 if (!user) {
                     wrongName = true;
                     return res.redirect("/users/signup")
                 }else{
                     return res.redirect("/users/login")
                 }
             })(req, res, next);
     });

//выход пользователя
     router.post('/exit', (req, res) => {
         req.logout();
         res.redirect('/users/login');
     })
 }
 module.exports.router = router;

//зависон при переходе с сигнап на логин