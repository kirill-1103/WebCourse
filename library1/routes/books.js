let express = require('express');
let router = express.Router();
let books = require('./index').books;
let Book = require('../public/javascripts/book').Book;

router.use('/',(req,res,next)=>{
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/users/login');
})


router.get('/:book_id',(req,res)=>{
    let id = req.params["book_id"];
    for(let book of books){
        if(`${book["id"]}_book`===id){
            res.render('book',{book:book,wrongBook:global.wrongBook,wrongReader:global.wrongReader,is_authorized:req.isAuthenticated()});
            wrongBook=false;
            wrongReader=false;
            break;
        }
    }
});

router.post('/new',(req,res)=>{
    let body = req.body;
    if(checkCorrectInputBook(body.name,body.date,body.author)){
        books.push(new Book(body.name,body.date,body.author));
    }else{
        global.wrongBook_=true;
    }
    res.redirect('/library')
})

router.post('/delete/:id',(req,res)=>{
    let id = req.params.id;
    let index=-1;
    for(let i = 0;i<books.length;i++){
        if(books[i].id==id){
            index=i;
        }
    }
    if(index!==-1) {
        books.splice(index,1);
        for(let book of books){
            console.log(book);
        }
        res.redirect('/library');
    }else{
        res.status(404);
        res.send('Book not found');
    }
})

router.post('/edit/:id',(req,res)=>{
    let id = req.params.id;
    let body = req.body;
    if(body.in_stock!== undefined && body.date_back!==undefined){
        if(body.in_stock.trim().length===0 || !body.date_back.match(/\d\d\d\d-\d\d-\d\d/)){
            global.wrongReader=true;
            res.redirect('/library/books/' + id+"_book");
            return ;
        }
        for(let book of books){
            console.log(book.id,id);
            if(book.id == id){
                book.in_stock=body.in_stock;
                book.date_back=body.date_back;
                res.redirect('/library/books/' + id+"_book");
                return;
            }
        }
    }else {
        if (!checkCorrectInputBook(body.name, body.date, body.author)) {
            global.wrongBook = true;
            res.redirect('/library/books/' + id);
            return;
        }
        for (let book of books) {
            if (book.id + "_book" == id) {
                book.name = body.name;
                book.author = body.author;
                book.date = body.date;
                res.redirect('/library/books/' + id);
                return;
            }
        }
    }
    res.status(404);
    res.send('Book not found');
})

router.post('/return/:id',(req,res)=>{
    let id = req.params.id;
    for(let book of books){
        if(book.id==id){
            book.in_stock='';
            book.date_back='';
            res.redirect('/library/books/'+id+"_book");
            return;
        }
    }
    res.status(404);
    res.send('Book not found');
})

function checkCorrectInputBook(name,date,author){
    return date.match(/\d\d\d\d-\d\d-\d\d/) && name.trim().length!==0 && author.trim().length!==0;
}


module.exports.router=router;