let login = document.getElementById("su_login");
let name  = document.getElementById("su_username");
let lastName = document.getElementById("su_lastname");
let password = document.getElementById("su_password");
let date = document.getElementById("su_birthday");
let genre = document.getElementById("su_genre");

let label_after_login = document.getElementById('label_after_login');
let label_after_password = document.getElementById("label_after_password");


login.addEventListener("input",(event)=>{
    if(login.value.length<5 || login.value.search(/^[a-z]([a-z]*[0-9]*)*$/)==-1){
        label_after_login.innerHTML = "Логин должен содержать не меньше 5 символов, может содержать маленькие латинские буквы и цифры, должен начинаться с буквы."
    }else{
        label_after_login.innerHTML='';
    }
});

password.addEventListener("input",(event)=>{
    if(password.value.length<6 || password.value.search(/^([a-z]*[0-9]*)*$/)==-1){
        label_after_password.innerHTML = 'Пароль должен содержать не меньше 6 символов, может содержать маленькие латинские буквы и цифры.'
    }else{
        label_after_password.innerHTML='';
    }
})

function checkCorrect(){
    let login_v = login.value;
    let password_v = password.value;
    let name_v = name.value;
    let lastName_v = lastName.value;
    let genre_v = genre.value;
    let date_v = date.value;
    return(login_v!=null  && password_v !=null&& name_v !=null&& lastName_v!=null && genre_v !=null&& date_v!=null &&
            password_v.length>=6 && login_v.length>=5 && login_v.search(/[a-z]([a-z]*[0-9]*)*/)!=-1 &&
            password_v.search(/^([a-z]*[0-9]*)*$/)!=-1 && date_v.search(/^\d\d\d\d-\d\d-\d\d$/)!=-1 &&
    genre_v.length!=0 && name_v.length!=0 && lastName_v.length!=0);
}

function validate_form(){
    let lab = document.getElementById('not_all_fields_are_full_label');
    let correct=checkCorrect();
    if(!correct)
        lab.innerHTML = 'Не все поля заполнены или заполненны некорректно.'
    return correct;
}


