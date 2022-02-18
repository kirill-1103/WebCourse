const logger = require("morgan");
const request = require('request');
const fs = require("fs");
const path = require("path");

module.exports=function(){
    request({//получаем данные с модуля администрирования
        method:'GET',
        url: 'http://localhost:3001/data'
    },(err,res,body)=>{
        try {
            if (!err && res.statusCode == 200) {
                let json_body = JSON.parse(body);
                addFieldsInPictures(json_body.pictures);
                addFieldsInParticipants(json_body.participants);
                addFieldsInSettings(json_body.settings);
                writeFiles(json_body);
            }
        } catch(er){
            logger.error('Не удалось получить данные с сервера!');
        }
    })
}

function addFieldsInPictures(pictures){
    for(let i of pictures){
        i.buy='';
        i.temp_price=i.start_price;
        i.buyer='-'
    }
}

function addFieldsInParticipants(participants){
    for(let i of participants){
        i.pictures = [];
    }
}

function addFieldsInSettings(settings){
    settings.current = '';
    settings.current_time = '';
}

function writeFiles(body){
    fs.writeFile(path.join(__dirname, '.', 'data', 'participants.json'), JSON.stringify(body.participants), (err) => {if(err) throw err});
    fs.writeFile(path.join(__dirname, '.', 'data', 'settings.json'), JSON.stringify(body.settings), (err) => {if(err) throw err});
    fs.writeFile(path.join(__dirname, '.', 'data', 'pictures.json'), JSON.stringify(body.pictures), (err) => {if(err) throw err});
}