//     
let settings;
let pictures;
let participants;
let socket = require('./sockets').socket;
$(document).ready(()=>{
    $.get('/data',(res)=>{
        settings = res.settings;
        pictures = res.pictures;
        participants=res.participants;
        if(settings.current_time!=''){//если аукцион уже идет
            addInformation(settings,pictures,participants);
        }else{
            $('#new_price_button').attr('disabled',true);
        }
        newPrice(pictures,settings,true);
        newPriceListener();
    })
})

function addInformation(settings,pictures,participants){
    let current_picture = settings.current;
    $('#new_price_button').attr('disabled',false);
    $('#user_author').text('Автор: ' + pictures[current_picture].author);
    $('#user_start').text('Минимальная цена: ' +pictures[current_picture].start_price);
    $('#user_temp').text('Текущая цена: '+pictures[current_picture].temp_price);
    $('#user_buyer').text('Предложил: ' + pictures[current_picture].buyer);
    $('#user_name').text('Название: '+pictures[current_picture].name);
    $('#user_description').text('Описание: '+pictures[current_picture].description);
    $('#user_image').attr('src',pictures[current_picture].src);
    $('#user_picture').removeClass('w3-hide');
}

function changeBalance(name       ,balance       ){
    if(name==$('#name').text()){
        $('#balance').text(balance);
    }
}

function newPrice(pictures,settings,t){
    let new_price = $('#new_price');
    let min = 0;
    if(settings.current!==''){
        min = pictures[settings.current].temp_price;
    }
    if(new_price.val() && new_price.val()<min || t) {
        new_price.val(min);
    }
    let spinner = new_price.spinner({
        min:min,
        step:25,
        start:1
    });
    new_price.on('input',()=>{
        let val = new_price.val();
        if(!val.match(/^[0-9]*$/)){
            new_price.val(min);
        }
    })
}

function getPictureIndexById(id){
    for(let i =0;i<pictures.length;i++){
        if(pictures[i].id==id){
            return i;
        }
    }
    throw new Error('not found');
}

function newPriceListener(){
    $('#new_price_button').on('click',()=>{
        let value = parseInt($('#new_price').val());
        $.get('/data',(res)=> {
            let pictures=res.pictures;
            let settings = res.settings;
            let participants = res.participants;
            let temp_price = pictures[settings.current].temp_price;
            if(value>temp_price && value<=getMoney(participants,$('#name').text())){
                socket.emit('new_price',{price:value,name:$('#name').text()});
            }else if(value<=temp_price){
                alert('Текущая стоимость картины больш или равна введенной!');
            }else{
                alert('У вас недостаточно средств!');
            }
        })
    })
}

function getMoney(participants,name){
    for(let i of participants){
        if(i.name===name){
            return i.money;
        }
    }
    throw new Error('Невозможно найти участника по имени!!!');
}

module.exports.newPrice =  newPrice;
module.exports.addInformation = addInformation;
module.exports.changeBalance = changeBalance;