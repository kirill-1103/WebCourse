let button_input = document.getElementById("button_input");
let name_input   = document.getElementById('name_input');


if(localStorage['user.back'] && localStorage["user.back"]!==undefined){
    name_input.value = localStorage["user.back"];
    delete localStorage["user.back"] ;
}


button_input.onclick = () => {
    let name = name_input.value;
    if(name!==null && name.trim().length!==0) {
        writeName(name);
        window.location.href = '../html/tetris.html';
    }else{
        alert('Введите не пустое имя!')
    }
}

function writeName(name){
    localStorage["tetris.user"] = name;
}


