var express = require('express');
var router = express.Router();
const fs = require('fs');
const logger = require('../utils/logger');
let participants ,pictures,settings;
let notFound=false;
let name='';
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ВХОД' ,notFound:notFound});
  notFound=false;
});

router.get('/settingsData',(req,res)=>{
    settings = require('../data/settings');
    res.send(settings);
})

router.get('/participantsData',(req,res)=>{
    participants = require('../data/participants');
    let names=[];
    for(let i of participants){
        names.push(i.name);
    }
    res.send({participants:names});
})

router.get('/data',(req,res)=>{
    participants = require('../data/participants');
    pictures = require('../data/pictures');
    settings = require('../data/settings');
    res.send({participants:participants,pictures:pictures,settings:settings});
})

router.post('/user',(req,res)=>{
  participants = require('../data/participants');
  pictures = require('../data/pictures');
  settings = require('../data/settings');
  let body = req.body;
  if(body.login==='admin'){
    res.redirect('/admin')
  } else if(findIndexByName(body.login)!==-1 ){
      let index = findIndexByName(body.login);
      name=body.login;
      res.redirect('/users/'+participants[index].id)
  }else{
    notFound=true;
    res.redirect('/');
  }
})



function findIndexByName(name,participants){
    let p;
    if(!participants) {
        p= require('../data/participants');
    }else{
        p=participants;
    }
  for(let i = 0 ;i<p.length;i++){
      if(p[i].name===name){
        return i;
      }
  }
  return -1;
}

module.exports = router;
module.exports.findIndexByName = findIndexByName;
