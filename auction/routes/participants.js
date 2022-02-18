const express = require('express')
const fs = require("fs");
const path = require("path");
const participants = require("../Data/participants.json");
const router = express.Router();

router.get('/',(req,res)=>{
    res.render('participants');
})
router.get('/participantsData',(req,res)=>{
    let participants = require('../Data/participants.json');
    if(!participants){
        res.status(404);
        res.send('not found!');
    }else{
        res.status(200);
        res.send({participants:participants});
    }
})

router.post('/new',(req,res)=>{
    let body=req.body;
    let participants = require('../Data/participants.json');
    let id = findNextParticipantId(participants);
    let participant = {
        id:id,
        name:body.name,
        money:body.money
    };
    participants.push(participant);
    writeInParticipants(participants);
    res.redirect('/participants');
})

router.post('/delete/:id',(req,res)=>{
    let id = req.params.id;
    let participants = require('../Data/participants.json');
    let index = getParticipantIndexById(id,participants);
    if(index==-1){
        res.status(404);
        res.send('not found');
    }else{
        participants.splice(index,1);
        writeInParticipants(participants);
        res.status(200);
        res.redirect('/participants');
    }
})

router.post('/edit/:id',(req,res)=>{
    let id = req.params.id;
    let participants = require('../Data/participants.json');
    let index = getParticipantIndexById(id,participants);
    if(index==-1){
        res.status(404);
        res.send('not found');
    }else{
        participants[index].name=req.body.name;
        participants[index].money=req.body.money;
        writeInParticipants(participants);
        res.status(200);
        res.redirect('/participants');
    }

})

function getParticipantIndexById(id,participants){
    for(let i=0;i<participants.length; i++){
        if(participants[i].id==id){
            return i;
        }
    }
    return -1;
}


function writeInParticipants(participants){
    fs.writeFile(path.join(__dirname,'..','Data','participants.json'),JSON.stringify(participants),(err)=>{
        if(err)throw err;
    });
}

function findNextParticipantId(participants){
    let clone = participants.slice(0);
    clone.sort((a,b)=>{return a.id-b.id});
    let count =0;
    for(let p of clone){
        if(p.id!=count){
            return count;
        }
        count++;
    }
    return count;
}



module.exports=router;