document.getElementById('title-name').innerHTML = localStorage['player'];

let canvas = document.getElementById('mapCanvas');
// gameManager.loadAll(canvas, '../maps/map1.json');

if(localStorage['level']==1) {
    gameManager.loadAll(canvas, '../maps/map1.json');
    console.log(localStorage['level'])
}else if(localStorage['level']==2){
    gameManager.loadAll(canvas, '../maps/map2.json');
    console.log(localStorage['level'])
}
gameManager.play(canvas);

function onReplay(){
    document.location.href = 'index.html'
}

function onLevels(){
    document.location.href = 'start.html'
}

function onPause(){
    let btn = document.getElementById('btn_pause');
    if(btn.textContent === 'Пауза' && !gameManager.gameOverFlag){
        btn.textContent='Играть';
        gameManager.pause();
    }else if(btn.textContent==='Играть'){
        btn.textContent = 'Пауза';
        gameManager.play(canvas);
    }
}

function onCloseModal(){
    document.getElementById('modal').style.display='none';
    gameManager.next();
}
