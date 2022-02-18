const domain = require('domain');
const d = domain.create();
const app = require('../app');
const http = require('http');
const logger = require('../utils/logger');
const request = require('request');
const port = normalizePort(process.env.PORT || '3000');
const fs = require('fs');
const path = require('path');
const {isString} = require("mocha/lib/utils");
let participants,pictures,settings;
app.set('port', port);
let start_picture=true;
let server;



d.on('error',(err)=>{
  logger.error('Ошибка перехвачена доменом, '+err);
})

d.run(
    ()=>{
        settings = require('../data/settings');
        participants=require('../data/participants');
        pictures = require('../data/pictures');

        server = http.createServer(app);
        let socket_io = require('socket.io')(server);
        socket_io.on('connection',function(socket){
            socket.on('conn',function(data){
                settings = require('../data/settings');
                participants=require('../data/participants');
                pictures = require('../data/pictures');
                socket.broadcast.emit('hello',{msg:`${data.name} вошел в чат`});
                socket.emit('hello',{msg:`${data.name} вошел в чат`});
            })

            socket.on('start_auction',function(){
                settings = require('../data/settings');
                participants=require('../data/participants');
                pictures = require('../data/pictures');
                let timeout = settings.timeout;
                let pause = settings.pause;

                socket.emit('start',{participants:participants,pictures:pictures,settings:settings,message:'Аукцион начался'});
                socket.broadcast.emit('start',{participants:participants,pictures:pictures,settings:settings,message:'Аукцион начался'});
                if(settings.current_time==''){
                    let timeout = getSecondsFromString(settings.timeout);
                    let pause  = getSecondsFromString(settings.pause);
                    let time = (timeout+pause+1)*pictures.length+1; //общее время аукциона
                    settings.current_time=time;
                }
                let current_picture_time =-2;
                let current_picture_pause = isString(settings.pause) ? getSecondsFromString(settings.pause) : settings.pause;
                let current_picture_index = 0;

                let interval = setInterval(()=>{
                    settings = require('../data/settings');
                    participants=require('../data/participants');
                    pictures = require('../data/pictures');

                    if(current_picture_pause==(isString(settings.pause) ? getSecondsFromString(settings.pause) : settings.pause)){//значит начинаются торги по новой картине
                        if(current_picture_index!=pictures.length) {
                            settings = require('../data/settings');
                            participants=require('../data/participants');
                            pictures = require('../data/pictures');

                            settings.current = current_picture_index++;
                            socket.emit('start_pause',{settings:settings,participants:participants,pictures:pictures});
                            socket.broadcast.emit('start_pause',{settings:settings,participants:participants,pictures:pictures})
                        }
                    }
                    if(current_picture_pause!=0){//значит пока пауза
                        socket.emit('pause',{pause:isString(current_picture_pause) ? getSecondsFromString(current_picture_pause) : current_picture_pause,settings:settings,participants:participants,pictures:pictures})
                        socket.broadcast.emit('pause',{pause: isString(current_picture_pause) ? getSecondsFromString(current_picture_pause) : current_picture_pause,settings:settings,participants:participants,pictures:pictures});
                        current_picture_pause--;
                        start_picture=true;
                    }else if(start_picture){//пауза закончилась
                        current_picture_time=isString(settings.timeout) ? getSecondsFromString(settings.timeout) : settings.timeout;
                        start_picture=false;
                    }
                    if(current_picture_time!=-2){
                        socket.emit('time',{settings:settings,participants:participants,pictures:pictures,time: isString(current_picture_time)?getSecondsFromString(current_picture_time) : current_picture_time})
                        socket.broadcast.emit('time',{settings:settings,participants:participants,pictures:pictures,time:isString(current_picture_time)?getSecondsFromString(current_picture_time) : current_picture_time});
                        current_picture_time--;
                        if(current_picture_time==-1){//если торги по картине закончились
                            current_picture_pause=getSecondsFromString(settings.pause);
                            current_picture_time=-2;

                            settings = require('../data/settings');
                            participants=require('../data/participants');
                            pictures = require('../data/pictures');

                            let picture = pictures[settings.current];
                            if(picture.buyer!='-') {
                                let index = getIndexParticipantByName(participants, picture.buyer);
                                if (index == -1) {
                                    throw new Error('not found!');
                                }
                                participants[index].money -= picture.temp_price;//убавляем количество средств участника
                                participants[index].pictures.push(picture.id);//добавляем ему картину
                                picture.buy = participants[index].name;//указываем кто купил картину
                                socket.emit('time_end',{settings:settings,participants:participants,pictures:pictures,participant:participants[index]});
                                socket.broadcast.emit('time_end',{settings:settings,participants:participants,pictures:pictures,participant:participants[index]});
                            }else {
                                socket.emit('time_end', {
                                    settings: settings,
                                    participants: participants,
                                    pictures: pictures,
                                    participant: null
                                });
                                socket.broadcast.emit('time_end', {
                                    settings: settings,
                                    participants: participants,
                                    pictures: pictures,
                                    participant: null
                                });
                            }
                        }
                    }

                    settings.current_time--;
                    writeFiles({settings:settings,participants:participants,pictures:pictures})
                    if(settings.current_time==0){
                        socket.emit('end_auction',{participants:participants,pictures:pictures,settings:settings})
                        socket.broadcast.emit('end_auction',{participants:participants,pictures:pictures,settings:settings})
                        clearInterval(interval);
                    }else {
                        socket.emit('next_time', {participants: participants, pictures: pictures, settings: settings})
                        socket.broadcast.emit('next_time', {participants: participants, pictures: pictures, settings: settings})
                    }
                },1000);
            })
            socket.on('new_price',function(data){
                console.log(data.price);
                settings = require('../data/settings');
                participants=require('../data/participants');
                pictures = require('../data/pictures');
                let temp = settings.current;
                pictures[temp].temp_price=data.price;
                pictures[temp].buyer =data.name;
                socket.emit('new_buyer',{participants: participants, pictures: pictures, settings: settings});
                socket.broadcast.emit('new_buyer',{participants: participants, pictures: pictures, settings: settings});
            })
        })
        server.listen(port);
    }
);

function getIndexParticipantByName(participants,name){
    for(let i = 0 ;i<participants.length;i++){
        if(participants[i].name==name){
            return i;
        }
    }
    return -1;
}


logger.info('Сервер прослушивает порт 3000');

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function writeFiles(body){
  fs.writeFile(path.join(__dirname, '..', 'data', 'participants.json'), JSON.stringify(body.participants), (err) => {if(err) throw err});
  fs.writeFile(path.join(__dirname, '..', 'data', 'settings.json'), JSON.stringify(body.settings), (err) => {if(err) throw err});
  fs.writeFile(path.join(__dirname, '..', 'data', 'pictures.json'), JSON.stringify(body.pictures), (err) => {if(err) throw err});
}


function getSecondsFromString(str_time){
    try {
        if (str_time.length !== 5 || str_time[2] !== ':') {
            throw new Error('Неверный тип строки для времени');
        }
        let minutes_str = str_time.charAt(0) + str_time.charAt(1);
        let minutes = parseInt(minutes_str);
        let seconds_str = str_time.charAt(3) + str_time.charAt(4);
        let seconds = parseInt(seconds_str);
        return minutes * 60 + seconds;
    }catch(err){
        logger.error('Перехвачена ошибка в getSecondsFromString: ' + err.message);
        return 0;
    }
}

function getStrTimeFromSeconds(seconds){
    try {
        if (seconds < 0) {
            throw new Error('Неверное количество секунд!');
        }
        let res = '';
        let minutes_ = Math.floor(seconds / 60);
        minutes_ < 10 ? res += `0${minutes_}:` : res += `${minutes_}:`;
        let seconds_ = seconds - minutes_ * 60;
        seconds_ < 10 ? res += `0${seconds_}` : res += seconds_;
        return res;
    }catch(err){
        console.log("Ошибка в geetStrTimeFromSeconds(): ",err.message);
        return '00:00';
    }
}


module.exports.getSecondsFromString = getSecondsFromString;
module.exports.getStrTimeFromSeconds = getStrTimeFromSeconds;