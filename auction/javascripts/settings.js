'use strict'
$(document).ready(()=>{
    $.get('/settings/Data',(res)=>{
        fillFields(res);
        addEditListeners(res);
    })
})

function fillFields(res){
    let settings = res.settings;
    $('#date-settings-label').text(`Дата аукциона: ${settings.date}`);
    $('#time-settings-label').text(`Время начала аукциона:    ${settings.time_start}`);
    $('#timeout-settings-label').text(`Таймаут продажи картины:    ${settings.timeout}`);
    $('#interval-settings-label').text(`Интервал времени отсчета:    ${settings.interval}`);
    $('#pause-settings-label').text(`Пауза на изучение картины:   ${settings.pause}`);
}

function addEditListeners(res){
    $('#edit-settings-button').on('click',function(){
        let warn = $('#warn_in_settings');//убираем сообщение об ошибке если оно есть
        if(warn){
            warn.detach();
        }

        let settings=res.settings;
        $('#view-settings-mode').hide();
        $('#edit-settings-mode').css('display','block')
        $('#settings-input-date').val(settings.date)
        $('#settings-input-time').val(settings.time_start);
        $('#settings-input-interval').val(settings.interval);
        $('#settings-input-pause').val(settings.pause);
        $('#settings-input-timeout').val(settings.timeout);
    })

    $('#cancel-settings-button').on('click',function(){
        $('#view-settings-mode').css('display','block');
        $('#edit-settings-mode').hide();
    })

    $('#ok-settings-button').on('click',function(){
        let warn = $('#warn_in_settings');
        if(warn){
            warn.detach();
        }

        let date = $('#settings-input-date').val();
        let time_start=$('#settings-input-time').val();
        let interval =$('#settings-input-interval').val();
        let pause =$('#settings-input-pause').val();
        let timeout =$('#settings-input-timeout').val();
        if(checkCorrectSettings(date,time_start,interval,pause,timeout)){
            let form = $('#form-edit-settings');
            form.attr({
                method:'post',
                action:'/settings/edit'
            });
            form.submit();
        }else{
            $('#cancel-settings-button').after(`<p style="color:red" id="warn_in_settings"> Не все поля заполнены правильно! </p>`)
        }
    })

}

function checkCorrectSettings(date,time_start,interval,pause,timeout){
    return date && time_start && interval && pause && timeout &&
        date.length!=0 && time_start.length!=0 && interval.length!=0 && pause!=0 && timeout!=0;
}