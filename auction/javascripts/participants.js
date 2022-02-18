'use strict'
$(document).ready(()=>{
    $.get('/participants/participantsData',(res)=>{
        fillParticipantsTable(res);
        addNewParticipantButtonListener();
        addContextListeners(res);
    })
})

function fillParticipantsTable(res){
    let participants = [];
    if(res.status!==404){
        participants = res.participants;
    }

    let table = $('#body_participants_table');
    for(let participant of participants){
        table.append((`<tr class="participants-tr">
                      <td class="id">${participant.id}</td>
                      <td class="participant-name">${participant.name}</td>
                      <td class="participants-money">${participant.money}</td>
                </tr>`))
    }
}

function addNewParticipantButtonListener(){
    $('#button_add_new_participant').on('click',()=>{
        let warn = $('#warn_add_participant');
        if(warn){
            warn.detach();
        }
        let name = $('#input_participant_name').val();
        let money = $('#input_participant_money').val();
        if(!name || name.length===0 || !money || money.length===0 || Number.parseInt(money)<0){
            $('#button_add_new_participant').before('<p style="color:red" id="warn_add_participant">Значения введены неправильно!</p>')
        }else{
            let form = $('#form_add_new_participant');
            form.attr({method:'post',action:'/participants/new'});
            form.submit();
        }
    })
}

function addContextListeners(res){
    $('.participants-tr').contextmenu(function(event){
        event.preventDefault();//запрещаем стандартное меню
        $('#div_context_menu_participant').css({
            display:'block',
            top:event.clientY,
            left:event.clientX,
        });

        let id = $(this).find('.id').text();

        addDeleteListener(id);
        addEditListener(id,res);
    })
    $('body').click(()=>{
        $('#div_context_menu_participant').hide();
    })
}

function addDeleteListener(id){
    $('#form_context_menu_participant_delete').on('click',function(){
        let form = $('#form_context_menu_participant_delete');
        form.attr({
            method:'post',
            action:'/participants/delete/'+id,
        });
        form.submit();
    })
}

function addEditListener(id,res){
    let participants = res.participants;
    $('#input_edit_participant').on('click',function(){
        let warn = $('#warn_in_participant_modal');//закрытие параграфа с ошибкой
        if(!warn){
            warn.detach();
        }

        $('#modal-edit-participant').fadeIn(400);
        let participant = getParticipantById(id,participants);
        $('#name_participant_in_modal').val(participant.name);
        $('#money_participant_in_modal').val(participant.money);
    })
    $('#cancel-edit-participant').on('click',function(){
        $('#modal-edit-participant').hide();
        $('#name_participant_in_modal').val('');
        $('#money_participant_in_modal').val(0);
    })
    $('#ok-edit-participant').on('click',function(){
        let warn = $('#warn_in_participant_modal');
        if(warn){
            warn.detach();
        }

        let name = $('#name_participant_in_modal').val();
        let money =$('#money_participant_in_modal').val();
        if(!name || name.length===0 || !money || money.length===0 || parseInt(money)<0){
            $('#cancel-edit-participant').after('<p id="warn_in_participant_modal" style="color:red"> Не все поля заполненны верно! </p>')
        }else{
            let form = $('#form-edit-participant');
            form.attr({
                method:'post',
                action:'/participants/edit/'+id
            })
            form.submit();
        }

    })
}

function getParticipantById(id,participants){
    for(let participant of participants){
        if(participant.id==id){
            return participant;
        }
    }
}