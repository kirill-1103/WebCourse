const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./user');//для создания пользователей
const fs = require('fs');
const path = require("path");

//сериализация

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    })

//десериализация
    passport.deserializeUser(function (id, done) {
        let user = null;
        let users = require('../../data/users.json')
        for (let i = 0; i < users.length; i++) {//ищем пользователя
            if (users[i].id === id) {
                user = users[i];
                done(null, user);
                break;
            }
        }
    })


//описание локальной стратегии авторизации
    passport.use('logIn', new LocalStrategy({usernameField: 'login',passwordField:'password'},
        function (login, password, done) {
                        let users = require('../../data/users.json');
                        for (let user of users) {
                            if (user.login === login && User.comparePasswords(password,user.password)) {
                                return done(null, user);
                            }
                        }
                        return done(null);
    }));

//описание стратегии регистрации
    passport.use('signup', new LocalStrategy({usernameField: 'login',passwordField:'password',passReqToCallback: true},//использовать login в качаестве имени, password в качестве пароля
        function (req,login, password, done) {
                        let users = require('../../data/users.json')
                        for (let u of users) {
                            if (u.login === login) {
                                console.log('Пользователь уже существует');
                                return done(null);
                            }
                        }
                        let id =0 ;
                        if(users.length!==0)
                            id = users[users.length-1].id+1;


                        let newUser = new User.User(id,login, req.body.username, req.body.userLastName, User.generatePassword(password), req.body.date, req.body.genre);
                        users.push(newUser);

                        //запись в файл
                        fs.writeFile(path.join(__dirname,'..','..','data','users.json'),JSON.stringify(users),(err)=>
                        {
                            if(err)throw err
                        })

                        return done(null, newUser);
        }));

module.exports = passport;