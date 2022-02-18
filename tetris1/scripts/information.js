const STANDARD_COLOR= '#679FD2';
const FALLING_COLOR_1 = 'red';
const FALLING_COLOR_3 = 'orange';
const FALLING_COLOR_4 = 'yellow';
const FALLING_COLOR_5 = 'green';
const FALLING_COLOR_6 = 'aqua';
const FALLING_COLOR_7 = 'blue';
const FALLING_COLOR_8 = 'purple';

//установка имени
let name = localStorage["tetris.user"];
let label = document.getElementById("name_user");
label.innerHTML = "Игрок: "+name;

//установка размеров канваса для следующей фигуры
let canvas_next_shape = document.getElementById("canvas_next_shape");
canvas_next_shape.width = 100;
canvas_next_shape.height = 100;

//отрисовка
let context_cns = canvas_next_shape.getContext('2d');

//обработчик кнопки перехода на страницу входа
let button_go_to_start = document.getElementById("button_go_to_start");
button_go_to_start.onclick = () => {
    window.location.href = '../index.html';
    localStorage["user.back"] = name;
}

//выводит количество очков
function printScores(n){
    let scores_label = document.getElementById('score');
    scores_label.innerHTML = 'Количество очков: '+n;
}

function setNextShape(shape) {
    let width_next_shape_block = Math.round(Math.min(canvas_next_shape.width / 4, canvas_next_shape.height / 4)) - 1;
    let height_next_shape_block = width_next_shape_block;

    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 4; j++) {
            //context_cns.strokeStyle = 'black';
            //context_cns.strokeRect(j*height_next_shape_block,i*width_next_shape_block,width_next_shape_block,height_next_shape_block);

            if (true) {
                switch (shape[i][j]) {
                    case 1:
                        context_cns.fillStyle = FALLING_COLOR_1;
                        break;
                    case 0:
                        context_cns.fillStyle = '#679FD2';
                        break;
                    case 3:
                        context_cns.fillStyle = FALLING_COLOR_3;
                        break;
                    case 4:
                        context_cns.fillStyle = FALLING_COLOR_4;
                        break;
                    case 5:
                        context_cns.fillStyle = FALLING_COLOR_5;
                        break;
                    case 6:
                        context_cns.fillStyle = FALLING_COLOR_6;
                        break;
                    case 7:
                        context_cns.fillStyle = FALLING_COLOR_7;
                        break;
                    case 8:
                        context_cns.fillStyle = FALLING_COLOR_8;
                        break;
                }


                context_cns.fillRect(j * height_next_shape_block, i * width_next_shape_block, width_next_shape_block, height_next_shape_block)
            }
        }
    }
}

const STR_DOTS = '...................';
const COUNT_RECORDS=10;
function updateRecordsIfNeed(name,record){
    for(let i = 0 ;i<COUNT_RECORDS;i++){
        let record_str = localStorage.getItem(`record_${i}`);
        if(record_str===null || record_str==='0' || record_str===STR_DOTS){
            addInRecords(name,record,i,true);
            break;
        }

        let index = 0;
        for(let j = record_str.length;j>0;j--){
            if(record_str.charAt(j)==='-'){
                index = j;
                break;
            }
        }

        let record_num = parseInt(record_str.substr(index+2));


        if(record>=record_num){
            addInRecords(name,record,i,false);
            break;
        }
    }
}

function addInRecords(name,record,position,isnull){
    if(isnull){
        localStorage.setItem(`record_${position}`,`${name} - ${record}`);
        return;
    }

    for(let i = COUNT_RECORDS-1;i>position;i--){
        localStorage.setItem(`record_${i}`,localStorage.getItem(`record_${i-1}`));
    }
    localStorage.setItem(`record_${position}`,`${name} - ${record}`);
}

let m_checkbox = document.getElementById('music_checkbox');
let range_value = document.getElementById('value_range');
let label_range = document.getElementById('label_range');
let main_audio = document.getElementById('main_sound');

range_value.style.display='none';
label_range.style.display='none';
m_checkbox.checked = false;
main_audio.loop=true;

function onOffMusic(){
    if(m_checkbox.checked){
        range_value.style.display='block';
        label_range.style.display='block';
        main_audio.volume = range_value.value/100;
        main_audio.play();
    }else{
        range_value.style.display='none';
        label_range.style.display='none';
        main_audio.pause();
        main_audio.currentTime = 0;
    }
}

function volumeChange(){
    main_audio.volume = range_value.value/100;
}



