let Book = function (name,date,author){
    let books = require('../../routes/index').books;
    this.id = getNextId(books);
    this.name=name;
    this.author=author;
    this.date=date;
    this.in_stock='';
    this.date_back='';
}

function getNextId(books){
    let i=0;
    let sort_books = books.slice();
    sort_books.sort((a,b)=>{
        return a.id>b.id;
    })
    for(let book of sort_books){
        let id = book["id"];
        if(id!==i++){
            return i-1;
        }
    }
    return i;
}

module.exports.Book=Book;
