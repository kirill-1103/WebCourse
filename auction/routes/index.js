const express = require('express');
const router = express.Router();
const fs  = require('fs');
const path = require('path');
const multer=require('multer');
let last_picture_id = undefined;


router.get('/', function(req, res, next) {
  res.redirect('/auction');
});

router.get('/data',(req,res)=>{
    let p = require('../Data/participants.json');
    let s = require('../Data/settings.json');
    let pic = require('../Data/pictures.json');
    let result = {
        participants:p,
        settings:s,
        pictures:pic
    };
    res.send(result);
})

router.get('/auction',function(req,res){
  res.render('index');
})

router.get('/picturesData',(req,res)=>{
  let pictures=require('../Data/pictures.json');
  if(!pictures){
    res.status(404);
    res.send({err:'not found'});
  }else {
    res.status(200);
    res.send({pictures: pictures});
  }
})

router.post('/auction/delete/picture/:id',(req,res)=>{
    let pictures = require('../Data/pictures.json');
    let id_in_arr= -1;
    for(let i = 0 ;i<pictures.length;i++){
        if(pictures[i].id==req.params.id){
            id_in_arr=i;
            break;
        }
    }
    if(id_in_arr==-1){
        res.status(404);
        res.send('not found');
    }
    pictures.splice(id_in_arr,1);
    writeInPictures(pictures);
    res.redirect('/auction');
})

router.post('/auction/edit/picture/:id',(req,res)=>{
    let id = req.params.id;
    let body = req.body;
    let pictures=require('../Data/pictures.json');
    let pic = findPicture(id,pictures);
    if(pic===-1){
        res.status(404);
        res.send('not found!');
    }
    changePicture(pic,body);

    writeInPictures(pictures);

    res.redirect('/auction');
});

router.post('/auction/add/picture',(req,res)=>{
    let body = req.body;
    let pictures=require('../Data/pictures.json');
    let id = findNextId(pictures);
    let picture = {
        id:id,
        src:`../../images/${id}.jpg`,
        name:body.name,
        in_auction:body.in_auction,
        author:body.author,
        start_price:body.start_price,
        min_step:body.min_step,
        max_step:body.max_step,
        description:body.description
    }
    pictures.push(picture);
    writeInPictures(pictures);
    res.redirect('/auction');
    last_picture_id=id;
})

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,path.join(__dirname,'..','public','images'));//директория в которую записываются файлы
    },
    filename: (req,file,cb) =>{
        if(last_picture_id!==undefined){
            cb(null,`${last_picture_id}.jpg`);
            last_picture_id=undefined;
        }else {
            cb(null, `${req.params.id}.jpg`);
        }
    }
})

const upload = multer({storage:storage});

router.post('/auction/edit/picture/img/:id',upload.single('file'),(req,res)=>{

})

router.post('/auction/add/picture/img',upload.single('file'),(req,res)=>{

})

function findPicture(id,pictures){
  for(let pic of pictures){
    if (pic.id==id){
      return pic;
    }
  }
  return -1;
}

function changePicture(pic,body){
    pic.name=body.name;
    pic.author=body.author;
    pic.start_price=body.start_price;
    pic.min_step=body.min_step;
    pic.max_step=body.max_step;
    pic.in_auction=body.in_auction;
    pic.description=body.description;
}

function writeInPictures(pictures){
    fs.writeFile(path.join(__dirname,'..','Data','pictures.json'),JSON.stringify(pictures),(err)=>{
        if(err)throw err;
    });
}

function findNextId(pictures){
    let clone = pictures.slice(0);
    clone.sort((a,b)=>{return a.id-b.id});
    let count =0;
    for(let pic of clone){
        if(pic.id!=count){
            return count;
        }
        count++;
    }
    return count;
}

module.exports = router;

