var express = require('express');
var router = express.Router();
const fs = require('fs');
const logger = require('../utils/logger');
let data ;

router.get('/:id',(req,res)=>{
    data = {pictures:require('../data/pictures'),settings:require('../data/settings'),participants: require('../data/participants')}
    let index = findIndexById(req.params.id);
    if(index==-1){
        res.status(200);
        res.end('not found');
    }else {
        res.render('user', {title:data.participants[index].name,participant:data.participants[index]});
    }
})

router.get('/my_pictures/:id',(req,res)=>{
    data = {pictures:require('../data/pictures'),settings:require('../data/settings'),participants: require('../data/participants')}
    let my_pictures = getMyPicturesIndexes(findIndexById(req.params.id));
    console.log(my_pictures);
    res.render('my_pictures',{title:'Мои картины',my_pictures:my_pictures,pictures:data.pictures,id:findIndexById(req.params.id)});
})

function findIndexById(id){
    data = {participants: require('../data/participants')}
    for(let i=0;i<data.participants.length;i++){
        if(data.participants[i].id==id){
            return i;
        }
    }
    return -1;
}
function getMyPicturesIndexes(index_participant,participants,pictures){
    if(!participants || !pictures){
        data = {participants: require('../data/participants'),pictures:require('../data/pictures.json')}
    }else{
        data={participants:participants,pictures:pictures};
    }
    let res=[];
    let my_pictures = data.participants[index_participant].pictures;
    for(let i = 0;i<my_pictures.length;i++){
        for(let j=0;j<data.pictures.length;j++){
            if(data.pictures[j].id==my_pictures[i]){
                res.push(j);
                break;
            }
        }
    }
    return res;
}

module.exports = router;
module.exports.getMyPicturesIndexes = getMyPicturesIndexes;
