class MapManager{
    mapData = null;//исходные данные карты
    tLayer = null;//слой карты
    xCount = 0;//ширина в блоках
    yCount = 0;//высота -/-
    tSize = {x:32,y:32};//размер блока
    mapSize = {x:32,y:32};//размер карты
    tilesets = [];//описания для каждого блока карты
    imgLoadCount = 0;//количество загруженных изображений
    imgLoaded = false;//все изображения загружены
    jsonLoaded = false;//описание json загружено
    view = {x:0,y:0,w:800,h:600};


    loadMap(path){
        let request = new XMLHttpRequest();
        let manager = this;
        request.onreadystatechange = function(){
            if(request.readyState===4 && request.status===200){
                manager.parseMap(request.responseText);
            }
        };
        request.open('GET',path,true);
        request.send();
    }
    parseMap(tilesJSON){
        this.mapData = JSON.parse(tilesJSON);
        this.xCount = this.mapData.width;//ширина в блоках
        this.yCount = this.mapData.height;//высота
        this.tSize.x = this.mapData.tilewidth;//ширина блока
        this.tSize.y = this.mapData.tileheight;
        this.mapSize.x = this.xCount*this.tSize.x;
        this.mapSize.y = this.yCount*this.tSize.y;
        let manager = this;

        for(let i = 0 ;i<this.mapData.tilesets.length;i++) {
            let img = new Image();
            img.onload = function () {
                manager.imgLoadCount++;
                if (manager.imgLoadCount === manager.mapData.tilesets.length) {
                    manager.imgLoaded = true;
                }
            }
            img.src = this.mapData.tilesets[i].image;
            let t = this.mapData.tilesets[i];
            let ts = {
                firstgid:t.firstgid,
                image:img,
                name:t.name,
                xCount:Math.floor(t.imagewidth/manager.tSize.x),
                yCount:Math.floor(t.imageheight/manager.tSize.y)
            }
            this.tilesets.push(ts);
        }
        this.jsonLoaded=true;
    }

    draw(ctx){//нарисовать карту
        if(!this.imgLoaded || !this.jsonLoaded){
            setTimeout(()=>{this.draw(ctx)},100);
        }else{
            if(this.tLayer === null){
                for(let id =0  ;id<this.mapData.layers.length;id++){
                    let layer = this.mapData.layers[id];
                    if(layer.type==='tilelayer'){
                        this.tLayer=layer;
                        break;
                    }
                }
            }
            if(this.tLayer) {
                for (let i = 0; i < this.tLayer.data.length;i++){
                    if(this.tLayer.data[i]!==0){
                        let tile=this.getTile(this.tLayer.data[i]);
                        let pX = (i%this.xCount)*this.tSize.x; //вычисление x в пикселях
                        let pY = Math.floor(i/this.xCount)*this.tSize.y;// -/-

                        //не рисуем за пределами видимой зоны
                        // if(!this.isVisible(pX,pY,this.tSize.x,this.tSize.y))
                        //     continue;
                        //сдвигаем видимую зону
                        // pX-=this.view.x;
                        // pY-=this.view.y;

                        ctx.drawImage(tile.img,tile.px,tile.py,this.tSize.x,
                        this.tSize.y,pX,pY,this.tSize.x,this.tSize.y);//берем часть изображения и помещаем в определенные координаты
                    }
                }
            }else{
                throw(new Error('tLayer is null!'));
            }
        }
    }
    isVisible(x,y,w,h){
        return !(x+w<this.view.x || y+h<this.view.y || x>this.view.x +this.view.w || y>this.view.y + this.view.h       )
    }

    getTile(tileIndex){
        let tile={
            img:null,
            px:0,
            py:0
        }
        let tileset = this.getTileset(tileIndex);
        tile.img = tileset.image;
        let id = tileIndex-tileset.firstgid;
        let x = id%tileset.xCount;//блок прямоугольный, остаток от деления на xCount дает x в tileset
        let y = Math.floor(id/tileset.xCount);//округление от деления на xCount дает y
        tile.px=  x*this.tSize.x;//координаты блока в пикселях на tileset
        tile.py = y*this.tSize.y;
        return tile;
    }

    getTileset(tileIndex){//получение блока по индексу
        for(let i=this.tilesets.length-1;i>=0;i--){
            if(tileIndex>=this.tilesets[i].firstgid){
                return this.tilesets[i];
            }
        }
        return null;
    }

    parseEntities(){//разбор слоя объектов
        if(!mapManager.imgLoaded || !mapManager.jsonLoaded){
            setTimeout(function(){mapManager.parseEntities()},100);
        }else{
            for(let j=0;j<this.mapData.layers.length;j++){
                if(this.mapData.layers[j].type==='objectgroup'){
                    let entities = this.mapData.layers[j];
                    for(let i = 0;i<entities.objects.length;i++){
                        let e = entities.objects[i];
                        try{
                            let obj = gameManager.factory[e.type]();
                            obj.name=e.name;
                            obj.pos_x=e.x;
                            obj.pos_y=e.y;
                            obj.type = obj.name+j*i;

                            obj.size_x=32;
                            obj.size_y=32;

                            gameManager.entities.push(obj);
                            if(obj.name==='player'){
                                gameManager.initPlayer(obj);
                            }
                        }catch(ex){
                            console.log('Error while creating:['+e.gid+']'+e.type+', '+ex);
                        }
                    }
                }
            }
        }
    }

    getTilesetIdx(x,y){

        //получение блока по кординатам на карте
        let idx = (Math.floor(y/this.tSize.y)) * this.xCount + Math.floor(x / this.tSize.x);
        return this.tLayer.data[idx];
    }


}
let mapManager = new MapManager();
