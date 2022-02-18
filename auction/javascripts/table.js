'use strict'
let pictures;
$(document).ready(()=>{
    $('#modal').fadeOut(0);
    $.get('/picturesData',(res)=>{
        fillTable(res);
        addListeners();
        addDeleteContext();
        addNewPictureListeners();
    })
})

function fillTable(res){
    pictures=[];
    if(res.status!==404) {
        pictures = res.pictures;
    }else{
        pictures=[];
    }
    let table= $('#body_table');
    for (let pic of pictures){//добавляем данные в таблицу
        let in_auction;
        if(pic.in_auction){
            in_auction='Да';
        }else{
            in_auction='Нет';
        }
        table.append((`<tr> 
                         <td class="id">${pic.id}</td>   
                         <td><img class="image-in-table" src=${pic.src} alt=${pic.name}></td>
                         <td>${pic.name}</td>
                         <td >${pic.author}</td>
                         <td>${pic.start_price}</td>
                         <td>${in_auction}</td></tr>`))
    }
}

function addListeners(){
    $('#body_table tr').click(function(){
        let id = $(this).find('.id').text();
        let pic = getPicture(id);
        $('#img_in_modal').attr('src',pic.src);
        $('.img-div').click(()=>{
            $('.big-img').attr('src',pic.src);
            $('.big-div').fadeIn(500);
        })
        $('#h2_name_picture').text(`${pic.name}`);
        $('#author_in_modal').text(`Автор: ${pic.author}`);
        $('#start_price_in_modal').text(`Начальная цена: ${pic.start_price}`);
        $('#min_step_in_modal').text(`Минимальный шаг: ${pic.min_step}`);
        $('#max_step_in_modal').text(`Максимальный шаг: ${pic.max_step}`);
        $('#description_in_modal').text(`Описание: ${pic.description}`);
        let in_auction;
        if(pic.in_auction){
            in_auction='Да';
        }else {
            in_auction = 'Нет';
        }
        $('#in_auction_in_modal').text('Учавствует в аукционе: '+in_auction)
        addEditButtonListener(pic);
        openModal();
    })
}

function getPicture(id){
    for(let pic of pictures){
        if(pic.id==id){
            return pic;
        }
    }
    throw 'not found picture';
}

function openModal(){
    $('.view-picture').css('display','block');
    $('.edit-picture').css('display','none');
    $('#modal').fadeOut(1111);
    $('#modal').fadeIn(300);
}

function addEditButtonListener(pic){
    $('#edit-image').click(()=>{
        $("#input_picture_name").val(pic.name);
        $(`#input_picture_author`).val(pic.author);
        $('#input_description').val(pic.description);
        $('#input_in_auction').attr('checked',pic.in_auction);
        $('#input_min_step').val(pic.min_step);
        $('#input_max_step').val(pic.max_step);
        $('#input_start_price').val(pic.start_price);
        $('#input_picture_src').attr('value','Файл не выбран');
        $('.view-picture').css('display','none');
        $('.edit-picture').css('display','block');

        addCancelButtonListener();
        addOkButtonListener(pic);
        $('#div_warn').css('display','none');
    })
}

function addCancelButtonListener(){
    $('#cancel').on('click',()=>{
        $('.edit-picture').css('display','none');
        $('.view-picture').css('display','block');
        $('#div-warn').css('display','none')
    })
}

function addOkButtonListener(pic){
    $('#ok').on('click',()=>{
        $('#div-warn').css('display','none');
        let name = $('#input_picture_name').val();
        let author = $('#input_picture_author').val();
        let description = $('#input_description').val();
        let price = $('#input_start_price').val();
        let min_step = $('#input_min_step').val();
        let max_step = $('#input_max_step').val();
        let src = $('#input_picture_src').val();
        if(checkCorrectData(pic,name,author,description,price,min_step,max_step,src)){
            let form = $('#form_edit_picture');
            form.attr('action','/auction/edit/picture/'+pic.id);
            form.attr('method','post');
            form.submit();

            //отправляем картинку
            if(src !== undefined && src.length!==0){
                loadImage('./auction/edit/picture/img/'+pic.id);
            }
        }else{
            $('#div-warn').css('display','block');
        }
    })
}

function addDeleteContext(){
    $('#body_table tr').contextmenu(function(event) {
        event.preventDefault();//запрещаем стандартное меню
        $('.right-click-menu').css({
            display:'block',
            top: `${event.clientY}px`,
            left: `${event.clientX}px`
        });
        let id = $(this).find('.id').text();
        $('#button_menuitem').on('click',function(){
            let form = $('#delete_form');
            form.attr('method','post');
            form.attr('action','/auction/delete/picture/'+id);
            form.submit();
        })
    });
    $('body').click(()=>{$('.right-click-menu').css('display','none');})//при клике лкм скрыть контекстное меню
}

function addNewPictureListeners(){
    $('#button_add_new_picture').on('click',()=>{
        $('#label_img_src').val('Изображение: ');
        $('.close-span').css('display','none');
        $('.view-picture').hide();
        $('.edit-picture').css('display','block');
        $('#ok').hide();
        $('#cancel').hide();
        $('#ok_new_picture').css('display','block');
        $('#cancel_new_picture').css('display','block');
        $('#modal').fadeIn(300);
        $('#div-warn').css('display','none');
    })

    $('#cancel_new_picture').on('click',()=>{
        $('#label_img_src').val('Изображение (если нужно поменять):');
        $('.close-span').css('display','block');
        $('.view-picture').css('display','block');
        $('.edit-picture').hide();
        $('#ok_new_picture').hide();
        $('#cancel_new_picture').hide();
        $('#ok').css('display','block');
        $('#cancel').css('display','block');
        $('#modal').fadeOut(1);
        $('#div-warn').css('display','none');
    })

    $('#ok_new_picture').on('click',()=>{
        let name = $('#input_picture_name').val();
        let author = $('#input_picture_author').val();
        let description = $('#input_description').val();
        let price = $('#input_start_price').val();
        let min_step = $('#input_min_step').val();
        let max_step = $('#input_max_step').val();
        let src = $('#input_picture_src').val();

        if(checkCorrectData('',name,author,description,price,min_step,max_step) && src!==undefined && src.length!==0 ){
            let form = $('#form_edit_picture');
            form.attr('method','post');
            form.attr('action','/auction/add/picture');
            form.submit();
            loadImage('/auction/add/picture/img');
        }else{
            $('#div-warn').css('display','block');
        }

    })
}

function checkCorrectData(pic,name,author,description,price,min_step,max_step){
    if(name.length===0 || author.length===0 || description.length===0 || price.length===0 || min_step.length===0 || max_step.length===0){
        return false;
    }
    return true;
}

function loadImage(url){
    let data=new FormData();
    data.append('file',$('#input_picture_src')[0].files[0]);
    $.ajax({
        url : url,
        type: 'POST',
        data:data,
        cache:false,
        dataType :'json',
        processData:false,//отключаем обработку передаваемых данных
        contentType:false,//отключаем установку загаловка, т.к. jq скажет серверу что это строковый запрос
        success:function(msg){
            if(msg.error!=''){
                alert('Не удалось загрузить изображение');
                console.log('error img');
            }
        }
    })
}
