const CATEGORY_ALL = 'all';
const CATEGORY_IN_STOCK = 'in_stock';
const CATEGORY_NOT_IN_STOCK ='not_in_stock';

function in_stock(){
    callAjaxPost(CATEGORY_IN_STOCK,res=>{
        in_or_not_in_stock(true,false,res);
    })
}

function not_in_stock(){
    callAjaxPost(CATEGORY_NOT_IN_STOCK,res=>{
        in_or_not_in_stock(false,true,res);
    })
}

function all_books(){
    callAjaxPost(CATEGORY_ALL,res=>{
        in_or_not_in_stock(true,true,res);
    })
}

function in_or_not_in_stock(in_stock_,not_in_stock_,res){
    let _books = JSON.parse(res);
    let filter_books = _books.in_stock;
    for(let book of filter_books){
        let row = document.getElementById(`${book.id}_book`);
        row.style.display=in_stock_ ? '' : 'none';
        console.log('in_stock:',row.style.display);
    }
    let other_books = _books.not_in_stock;
    for(let book of other_books){
        let row = document.getElementById(`${book.id}_book`)
        row.style.display= not_in_stock_ ? '' : 'none';
        console.log('not_in_stock:',row.style.display);
    }
}


function callAjaxPost(category,callback){
    let xhttp = new XMLHttpRequest();
    xhttp.open('POST',"/library/",true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.onreadystatechange = function (){
        if(xhttp.readyState==4 && xhttp.status==200){
            callback(this.responseText);
        }
    }
    let body = {'category':category};
    xhttp.send(`category=${category}`);
}