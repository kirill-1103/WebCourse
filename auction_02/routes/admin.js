var express = require('express');
var router = express.Router();
const fs = require('fs');
const logger = require('../utils/logger');
let data;


router.get('/',(req,res)=>{
    data = {pictures:require('../data/pictures'),settings:require('../data/settings'),participants: require('../data/participants')}
    res.render('admin',{title:'Админ',participants:data.participants, pictures:data.pictures});
})

module.exports = router;