const { io} = require('socket.io-client');
const socket = io();
const Ent= 'ВХОД';
let participants,pictures,settings;

$(document).ready(()=>{
    socket.on('connect',function(){
        let name = $('#name').text();
        if(name!=Ent) {
            socket.emit('conn', {name: name});
        }
    })

    socket.on('hello',function(data){
        let message=data.msg;
        addMessage(message);
    })
    
    socket.on('start',function(data){
        let message:string=data.message;
        addMessage(message);
        $('#button_start_auction').attr('disabled',true);
        $('#new_price_button').attr('disabled',false);
    })

    socket.on('next_time',function(data){
        participants=data.participants;
        pictures=data.pictures;
        settings=data.settings;
        updateInformation(settings,pictures,participants);
    })

    socket.on('end_auction',function(data){
        participants=data.participants;
        pictures=data.pictures;
        settings=data.settings;
        updateInformation(settings,pictures,participants);
        endAuction();
        $('#user_picture').addClass('w3-hide');
    })

    socket.on('start_pause',function(data){
        pictures=data.pictures;
        settings=data.settings;
        $('#new_price_button').attr('disabled',true);
        newPicturePause(pictures,settings);
        addCurrentPictureInUser(pictures,settings);
        require('./users').newPrice(pictures,settings,true);
    })

    socket.on('pause',function(data){
        pictures=data.pictures;
        settings=data.settings;
        let pause = data.pause;
        printPause(pause);
        $('#new_price_button').attr('disabled',true);
        require('./users').newPrice(pictures,settings,false);
    })

    socket.on('time',function(data){
        participants=data.participants;
        pictures=data.pictures;
        settings=data.settings;
        let time = data.time;
        if(time == getSecondsFromString(settings.timeout)) {//значит торги только начались
            newPictureTime(pictures,settings);
        }
        printTime(time);
        $('#new_price_button').attr('disabled',false);//разрешаем повышать стоимость
    })

    socket.on('time_end',function(data){//торги по картине закончились
        participants=data.participants;
        pictures=data.pictures;
        settings=data.settings;
        let participant=data.participant;
        $('#new_price_button').attr('disabled',true);//запрещаем повышать цены
        let picture = pictures[settings.current];
        if(!participant){
            addMessage('Картину никто не купил :(');
        }else{
            addMessage('Картина продана '+picture.buy +' за '+picture.temp_price +'!');
            require('./admin').updateInformation(settings,pictures,participants,participant);//обновляем инф. у админа
            require('./users').changeBalance(participant.name,participant.money);
        }

    })
    
    socket.on('new_buyer',function (data){
        participants=data.participants;
        pictures=data.pictures;
        settings=data.settings;
        newBuyerText(settings,pictures);
        require('./users').addInformation(settings,pictures,participants);//обновляем информацию на странице пользователя
        require('./admin').updateInformation(settings,pictures,participants);
    })
})

function addMessage(message:string){
    let now = new Date();
    let hours = now.getHours();
    let string_hours = hours>9 ? hours : '0'+hours;
    let minutes = now.getMinutes();
    let string_minutes = minutes>9?minutes:'0'+minutes;
    let seconds = now.getSeconds();
    let string_seconds = seconds>9? seconds:'0'+seconds;
    $('#chat').append(`<p> <label class="w3-text-cyan">${string_hours}:${string_minutes}:${string_seconds}</label> -  ${message}`);
}

function updateInformation(settings,pictures,participants){
    let time_end = $('#time_end_auction');
    let time  = settings.current_time;
    time_end.text('До конца аукциона: ' + getStrTimeFromSeconds(time));


}

function endAuction(){
    addMessage('Аукцион закончен!');
    $('#new_price_button').attr('disabled',true);
    $('#time_end_picture').addClass('w3-hide');
}



function getStrTimeFromSeconds(seconds:number):string{
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

function newPicturePause(pictures,settings){
    addMessage(`Начало ожидания торгов по картине \"${pictures[settings.current].name}\".`)
}

function printPause(pause){//выводим сколько до конца паузы
    let time_end_picture = $('#time_end_picture');
    time_end_picture.text('До конца паузы: ' + getStrTimeFromSeconds(pause));
}

function newPictureTime(pictures,settings){
    addMessage(`Торги по картине \"${pictures[settings.current].name}\" начались!`)
}

function printTime(time){
    let time_end_picture = $('#time_end_picture');
    time_end_picture.text('До конца торгов по картине: ' + getStrTimeFromSeconds(time));
}

function addCurrentPictureInUser(pictures,settings){
    let current_picture=settings.current;
    $('#user_author').text('Автор: ' + pictures[current_picture].author);
    $('#user_start').text('Минимальная цена: ' +pictures[current_picture].start_price);
    $('#user_temp').text('Текущая цена: '+pictures[current_picture].temp_price);
    $('#user_buyer').text('Предложил: ' + pictures[current_picture].buyer);
    $('#user_name').text('Название: '+pictures[current_picture].name);
    $('#user_description').text('Описание: '+pictures[current_picture].description);
    $('#user_image').attr('src',pictures[current_picture].src);
    $('#user_picture').removeClass('w3-hide');
}

function getSecondsFromString(str_time){
    let minutes_str = str_time.charAt(0) + str_time.charAt(1);
    let minutes = parseInt(minutes_str);
    let seconds_str = str_time.charAt(3)+str_time.charAt(4);
    let seconds = parseInt(seconds_str);
    return minutes*60+seconds;
}

function newBuyerText(settings,pictures){
    addMessage(`${pictures[settings.current].buyer} повысил стоимость картины до ${pictures[settings.current].temp_price}!`)
}

module.exports.socket=socket;
