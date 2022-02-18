document.getElementById('title-name').innerHTML = localStorage['player'];


for(let i = 1 ;i<3;i++){
    for(let j = 0;j<10;j++){
        if(!localStorage[`lvl${i}rec${j+1}`]){
            localStorage[`lvl${i}rec${j+1}`]=(j+1)+'-----------'
            localStorage[`lvl${i}name${j+1}`]='-----------'
        }
    }
}


let lvl1 = document.getElementById('r-level1');
let lvl2 = document.getElementById('r-level2');
let lvl = 0;
if(lvl1.checked){
    lvl=1;
}else{
    lvl=2;
}
fillRecords(lvl);

function onLvl1(){
    lvl=1;
    fillRecords(lvl);
}

function onLvl2(){
    lvl=2;
    fillRecords(lvl)
}

function fillRecords(lvl){
    for(let i = 0 ;i<10;i++){
        let record = document.getElementById(`score_${i+1}`);
        let name = document.getElementById(`name_${i+1}`);
        record.innerHTML = localStorage[`lvl${lvl}rec${i+1}`]
        name.innerHTML = localStorage[`lvl${lvl}name${i+1}`];
    }
}

function onPlay(){
    localStorage['level']=lvl;
    document.location.href='./index.html';
}

function onLogin(){
    document.location.href='./login.html';

}
