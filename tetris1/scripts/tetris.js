
let yposition;//y-позиция фигуры
let xposition;//x-позиция фигуры
let shape;//фигура
let time;//время , от которого зависит скорость игры
let next_up;// количество очков для следующего увеличения скорости
let scores ;//количество очков
let next_shape;//следующая фигуры
let coef_score;//коэффициент умножения очков
let row_sound = document.getElementById("row_sound");//звук
let timeout;//таймер

//игровое поле
let array_field= [
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0]
]

let shapes = {
    shape1 : [
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ],
    shape2 : [
        [3,0,0,0],
        [3,3,3,0],
        [0,0,0,0],
        [0,0,0,0]
    ],
    shape3 : [
        [0,0,4,0],
        [4,4,4,0],
        [0,0,0,0],
        [0,0,0,0]
    ],
    shape4 :  [
        [5,5,0,0],
        [5,5,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ],
    shape5 : [
        [0,6,6,0],
        [6,6,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ],
    shape6 : [
        [0,7,0,0],
        [7,7,7,0],
        [0,0,0,0],
        [0,0,0,0]
    ],
    shape7 : [
        [8,8,0,0],
        [0,8,8,0],
        [0,0,0,0],
        [0,0,0,0]
    ],
}

//поворот фигуры
function rotate(shape){
    let res_shape=[
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]
    for(let i = 0 ;i<4;i++){
        for(let j = 0 ;j<4;j++){
            res_shape[i][j] = shape[3-j][i];
        }
    }
    let len = length(res_shape);
    let dist = 4 - len;
    res_shape = shiftLeft(res_shape,dist);
    if(checkCorrectShapePosition(res_shape)){
        return res_shape;
    }else{
        return shape;
    }
}

//проверка позиции фигуры после поворота или перемещения по горизонтали
function checkCorrectShapePosition(shape){
    for(let i = 0; i<shape.length;i++){
        for(let j = 0 ;j<shape[i].length;j++){
            if(isShape(shape[i][j])){
                if(i+yposition-height(shape)>=array_field.length ||
                        j+xposition<0 || j+xposition>=array_field[i].length){
                    return false;
                }
                if(i+yposition-height(shape)<0){
                    continue;
                }
                if (array_field[i + yposition - height(shape)][j + xposition] === 2) {
                    return false;
                }
            }
        }
    }
    return true;
}

//сместить фигуру внутри блока к левому краю
function shiftLeft(shape,dist){
    if(dist===0){
        return shape;
    }
    for(let i = 0 ;i<4;i++){
        for(let j = 0 ;j<4;j++){
            if(isShape(shape[i][j])){
                shape[i][j-dist]=shape[i][j];
                shape[i][j]=0;
            }
        }
    }
    return shape;
}

function isShape(n){

    return n<=8 && n>=1 && n!==2;
}

//сколько фигура занимает по горизонтали
function length(shape){
    let count = 0;
    for(let i = 0 ;i<4;i++){
        for(let j = 0 ;j<4;j++){
            if(isShape(shape[j][i])){
                count++;
                break;
            }
        }
    }
    return count;
}

//высота фигуры
function height(shape){
    let count = 0;
    for(let i = 0 ;i<4;i++){
        for(let j = 0 ;j<4;j++){
            if(isShape(shape[i][j])){
                count++;
                break;
            }
        }
    }
    return count;
}

//возврщает рандомную фигуру
function generateShape(){
    let random_number_shape = Math.floor(Math.random()*7) + 1;
    return shapes["shape"+random_number_shape];
}

// function getNumberByShape(shape){
//
// }
//
// function compareShapes(shape1,shape2){
//     for(let i = 0 ;i<shape1.length;i++){
//         for(let j =0;j<shape2.length;j++)
//         {
//             if(shape1[i][j]!==shape2[i][j])
//         }
//     }
// }

//вставляет фигуру
function insertShape(shape,x,y){
    clearOldShape();//очистим место
    for(let i = 0 ;i<4;i++){
        for(let j=0;j<4;j++){
            try {
                if(isShape(shape[i][j])) {
                    array_field[y + i][x + j] = array_field[y + i][x + j] === 0 ? shape[i][j] : array_field[y + i][x + j];
                }
            }catch(err){}
        }
    }
}

//очищает место которое уже не заполненно текущей фигурой
function clearOldShape(){
    for(let i = 0;i<array_field.length;i++){
        for(let j = 0;j<array_field[i].length;j++){
            if(isShape(array_field[i][j])){
                array_field[i][j]=0;
            }
        }
    }
}

//проверить упала ли фигура
function checkFell(){
    for(let i = 0 ;i<array_field.length;i++){
        for(let j = 0;j<array_field[i].length;j++){
            if(isShape(array_field[i][j])){
                if(i+1===array_field.length){
                    return true;
                }
                if(array_field[i+1][j]===2){
                    return true;
                }
            }
        }
    }
    return false;
}

//присоединяет текущую к полю, если она упала
function attachShape(){
    for(let i = 0;i<array_field.length;i++){
        for(let j = 0 ;j<array_field[i].length;j++){
            if(isShape(array_field[i][j])){
                array_field[i][j]=2;
            }
        }
    }
}

//проверка на поражение
function checkLoss() {
    for (let i = 0; i < array_field[0].length; i++) {
        if (array_field[0][i] === 2) {
            return true;
        }
    }
    return false;
}

//возвращает заполненные ряды (номера)
function getFullRows(){
    let rows = [];
    for(let i = 0 ;i<array_field.length;i++){
        let row = true;
        for(let j = 0 ;j<array_field[i].length;j++){
            if(array_field[i][j]!==2){
                row=false;
            }
        }
        if(row){
            rows.push(i);
        }
    }
    return rows;
}

//удаляет заполенные ряды
function delRows(rows){
        rows.forEach((row) => {
            for (let i = 0; i < array_field[row].length; i++) {
                array_field[row][i] = 0;
            }
            lowerRows(row);
        })
}

//спускает ряды выше, после удаления
function lowerRows(row){
    for(let i = row;i>0;i--){
        array_field[i] = array_field[i-1].slice(0);
    }
}

//возвращает количество очков полученное за разрушение одного или нескольких рядов
function getScores(quantity_rows){
    switch (quantity_rows){
        case 1:
            return 100;
        case 2:
            return 300;
        case 3:
            return 700;
        case 4:
            return 1500;
    }
}

//очищение поля
function clearField(){
    for(let i = 0 ;i<array_field.length;i++){
        for(let j = 0 ;j<array_field[i].length;j++){
            array_field[i][j]=0;
        }
    }
    fillField();
}

function delRowsIfNeed(){
    let rows = getFullRows();
    if(rows.length!==0){//проверка на полный ряд
        delRows(rows);
        scores += Math.round(getScores(rows.length)*coef_score);
        if(document.getElementById('music_checkbox').checked) {
            row_sound.volume = document.getElementById("value_range").value / 100;
            row_sound.play();
        }
    }
}

function upLvlIfNeed(){
    if(scores>=next_up){//каждые1000 очков увеличение скорости
        let up = Math.floor((scores-next_up)/1000)+1;
        if(time>300) {

            time-=100*up;
            time = time>=300 ? time : 300;
            coef_score+=0.1*up;
        }
        next_up+=up*1000;
    }
}

function gameOver(){
    updateRecordsIfNeed(name,scores);
    window.location.href = "records.html";
}

function changeShape(){// меняет фигуру
    shape = next_shape.slice(0);
    next_shape = generateShape();
    setNextShape(next_shape);
    xposition=4;
    yposition=0;
}

function tick(){
    if(checkFell()) {
        attachShape();
        fillField();
        delRowsIfNeed();
        upLvlIfNeed();
        if(checkLoss()){//проверка на окончание игры
            gameOver();
            clearTimeout(timeout);
            return;
        }
        changeShape();
    }
    yposition++;
    insertShape(shape,xposition,yposition-height(shape));
    fillField();
    printScores(scores);
    timeout = setTimeout(tick, time);
}

function init(){
    next_up = 1000;
    scores = 0;
    time=1000;
    yposition = 0 ;
    xposition = 4;
    shape=generateShape();
    next_shape = generateShape();
    coef_score = 1;
}

function startGame(){
    init();
    //printRecords();
    setNextShape(next_shape);
    timeout = setTimeout(tick,time);
}

startGame();

