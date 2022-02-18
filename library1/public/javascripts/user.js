const bcrypt = require('bcrypt');


let User = function (id,login,name,lastname,password,date,genre){
    this.id = id;
    this.login = login;
    this.name=name;
    this.lastname=lastname;
    this.password=password;
    this.date = date;
    this.genre = genre;
}

module.exports.generatePassword = function (password){
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const passwordToSave = bcrypt.hashSync(password,salt);
    return passwordToSave;
}

module.exports.comparePasswords = function (password,passwordHash){
    return bcrypt.compareSync(password,passwordHash);
}

module.exports.User = User;