const express = require('express')
const router  = express.Router();
const fs = require('fs');
const path = require("path");
const moment = require('moment');
const settings = require("../Data/settings.json");

router.get('/',(req,res)=>{
        res.render('settings');
})

router.get('/Data',(req,res)=>{
        let settings = require('../Data/settings.json');
        res.send({settings:settings});
})

router.post('/edit',(req,res)=>{
        let settings = require('../Data/settings.json');
        let body = req.body;

        let date= moment(body.date,["YYYY-MM-DD"]);
        settings.date=date.format("DD.MM.YYYY");

        settings.timeout=body.timeout;
        settings.interval=body.interval;
        settings.time_start=body.time_start;
        settings.pause=body.pause;
        res.redirect('/settings');
        fs.writeFile(path.join(__dirname,'..','Data','settings.json'),JSON.stringify(settings),(err)=>{
                if(err)throw err;
        })
})

module.exports=router;