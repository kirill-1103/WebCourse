let express = require('express');
let router = express.Router();
const CATEGORY_ALL = 'all';
const CATEGORY_IN_STOCK = 'in_stock';
const CATEGORY_NOT_IN_STOCK ='not_in_stock';
let books = require('../data/books.json');
const e = require("express");

router.get('/',(req,res)=>{
     res.redirect('/library');
 })

router.use('/library',(req,res,next)=>{
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/users/login');
    })

router.get('/library',(req,res)=>{
    res.render('library',{books:books,wrongBook:global.wrongBook_,is_authorized:req.isAuthenticated()});
    global.wrongBook_=false;
})

router.post('/library',(req,res)=>{
    if(req.body.category === CATEGORY_IN_STOCK || req.body.category===CATEGORY_NOT_IN_STOCK || req.body.category===CATEGORY_ALL){
        let arr_in_stock =new Array();
        let arr_not_in_stock= new Array();
        for(let book of books){
            if(book.in_stock===''){
                arr_in_stock.push(book);
            }else{
                arr_not_in_stock.push(book);
            }
        }
        res.end(JSON.stringify({in_stock:arr_in_stock,not_in_stock:arr_not_in_stock}));
    }
})

module.exports = router;
module.exports.books = books;