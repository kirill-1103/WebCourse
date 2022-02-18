//     
let socket = require('./sockets').socket;
let settings;
let pictures;
let participants;
$(document).ready(()=>{
    $.get('/data',(res)=>{
        settings = res.settings;
        pictures = res.pictures;
        participants = res.participants;
        next();
    })
})

function next(){
    $('#admin_pictures').accordion({
        collapsible:true,
        header: "h3",
        heightStyle: "content"
    });

    if(settings.current_time!=''){//если ауцион уже идет
        $('#button_start_auction').attr('disabled',true);
    }

    $('#button_start_auction').on('click',()=>{//нажата кнопка 'Начать аукцион'
        socket.emit('start_auction');
    })
}

function updateInformation(settings,pictures,participants,participant){
    let picture = pictures[settings.current];
    $(`#temp_price_${picture.id}`).text('Текущая цена: '+picture.temp_price);
    $(`#buyer_${picture.id}`).text(`Предложил: ${picture.buyer}`);
    $(`#buy_${picture.id}`).text('Продана: '+picture.buy);
    if(participant){
        $(`#balance_${participant.id}`).text(`Запас средств: ${participant.money}`)
    }
}

module.exports.updateInformation = updateInformation;
