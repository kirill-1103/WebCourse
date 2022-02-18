class PhysicManager{
    update(obj){
        if(obj.move_x===0 && obj.move_y===0 && obj.onGround){
            return 'stop';
        }
        let newX = obj.pos_x +Math.floor(obj.move_x*obj.speed);
        let newY = obj.pos_y +Math.floor(obj.move_y*obj.speed);
        //анализ пространства на карте по направлению движения

        if(!obj.onGround){
            obj.move_y+=0.35;
        }
            let newCoord = this.blockAtXY(obj, newX, newY);//если стена не двигаемся
            newX = newCoord.x;
            newY = newCoord.y;


        let ts = mapManager.getTilesetIdx(newX+obj.size_x/2,newY+obj.size_y/2);
        let e = this.entityAtXY(obj,newX,newY);//проверка объекта на пути
        if(e!==null && obj.onTouchEntity){
            obj.onTouchEntity(e);
            if(obj.name==='Bomb'){
                let index = gameManager.entities.findIndex((el,index,array)=>{return el.name==='Bomb'})
                if(index!==-1){
                    obj.pos_x=newX;
                    obj.pos_y=newY;
                }
            }
            if(obj.name==='player'){
                if(e.name==='coin'){
                    obj.pos_x=newX;
                    obj.pos_y=newY;
                }
            }
            if(obj.name==='enemy'){
                if(e.name!=='player'){
                    obj.pos_x=newX;
                    obj.pos_y=newY;
                }
            }
        }
        if(e==null){
            obj.pos_x=newX;
            obj.pos_y=newY;
        }
    }
    entityAtXY(obj,x,y){//поиск по координатам
        for(let  i =0 ;i<gameManager.entities.length;i++){
            let e = gameManager.entities[i];
            if(e.name !== obj.name){
                if(x+obj.size_x<e.pos_x || y+obj.size_y<e.pos_y || x>e.pos_x + e.size_x || y>e.pos_y+e.size_y){
                    continue;
                }
                return e;
            }
        }
        return null;
    }
    blockAtXY(obj,x,y){
        let name = obj.name.substring(0,1).toUpperCase()+obj.name.substring(1,obj.name.length);
        let sprite = spriteManager.getSprite(name);

        if(x<0 || y+4<0 || x+sprite.wOnMap>mapManager.mapSize.x || y+sprite.hOnMap>mapManager.mapSize.y){
            // console.log(x<0,y+4<0)
            if(obj.name==='Bomb'){
                obj.kill();
            }
            if(obj.name==='enemy'){
                obj.move_x*=-1;
            }
            x=obj.pos_x;
            y=obj.pos_y;
            return{x:x,y:y};
        }


        if(obj.move_x>0) {
            let tileset1 = mapManager.getTilesetIdx(x + sprite.wOnMap-5, y + sprite.hOnMap-4);
            let tileset2 = mapManager.getTilesetIdx(x + sprite.wOnMap-5, y + sprite.hOnMap/2);
            let tileset3 = mapManager.getTilesetIdx(x + sprite.wOnMap-5, y+4);

            if(check(tileset1,tileset2,tileset3)){
                if(obj.name!=='Bomb') {
                    x = obj.pos_x
                }else{
                    obj.kill();
                }
                if(obj.name==='enemy'){
                    obj.move_x*=-1;
                }
            }
            if(!checkOnGround(x,y,sprite) ) {
                if (obj.name !== 'Bomb'){
                    // console.log(obj.name)
                    obj.onGround = false;
                }
            }
        }
        if(obj.move_x<0){
            let tileset1 = mapManager.getTilesetIdx(x+5, y + sprite.hOnMap-4);
            let tileset2 = mapManager.getTilesetIdx(x+5,  y + sprite.hOnMap/2);
            let tileset3 = mapManager.getTilesetIdx(x+5, y+4);

            if(check(tileset1,tileset2,tileset3)){
                if(obj.name!=='Bomb'){
                    x=obj.pos_x;
                }else{
                    obj.kill();
                }
                if(obj.name==='enemy'){
                    obj.move_x*=-1;
                }
            }
            if(!checkOnGround(x,y,sprite) )
            {
                if(obj.name!=='Bomb'){
                    obj.onGround=false;
                }
            }
        }

        if(obj.move_y>0){
            let tileset1 = mapManager.getTilesetIdx(x+sprite.wOnMap-8, y + sprite.hOnMap-5);
            let tileset2 = mapManager.getTilesetIdx(x+sprite.wOnMap/2,  y + sprite.hOnMap-5);
            let tileset3 = mapManager.getTilesetIdx(x+4, y+sprite.hOnMap-5);

            if(check(tileset1,tileset2,tileset3)){
                y=obj.pos_y
                tileset1 = mapManager.getTilesetIdx(x+sprite.wOnMap-4, y + sprite.hOnMap-5);
                tileset2 = mapManager.getTilesetIdx(x+sprite.wOnMap/2,  y + sprite.hOnMap-5);
                tileset3 = mapManager.getTilesetIdx(x+4, y+sprite.hOnMap-5);
                while(!check(tileset1,tileset2,tileset3)){
                    tileset1 = mapManager.getTilesetIdx(x+sprite.wOnMap-4, y + sprite.hOnMap-5);
                    tileset2 = mapManager.getTilesetIdx(x+sprite.wOnMap/2,  y + sprite.hOnMap-5);
                    tileset3 = mapManager.getTilesetIdx(x+4, y+sprite.hOnMap-5);
                    y+=1;
                }
                y-=5;
                obj.move_y=0;
                obj.onGround=true;
            }
        }

        if(obj.move_y<0){
            let tileset1 = mapManager.getTilesetIdx(x+sprite.wOnMap-4, y + 5);
            let tileset2 = mapManager.getTilesetIdx(x+sprite.wOnMap/2,  y + 5);
            let tileset3 = mapManager.getTilesetIdx(x+4, y+5);
            if(check(tileset1,tileset2,tileset3)){
                y=obj.pos_y
                obj.move_y=0;
            }
        }

        function check(tileset1,tileset2,tileset3){
            let tile1 = mapManager.getTile(tileset1);
            let tile2 = mapManager.getTile(tileset2);
            let tile3 = mapManager.getTile(tileset3);

            return tile1.img.src.includes('block')|| tile2.img.src.includes('block')|| tile3.img.src.includes('block');
        }

        function checkOnGround(x,y,sprite) {
            let tileset1 = mapManager.getTilesetIdx(x + sprite.wOnMap - 8, y + sprite.hOnMap);
            let tileset2 = mapManager.getTilesetIdx(x + sprite.wOnMap / 2, y + sprite.hOnMap);
            let tileset3 = mapManager.getTilesetIdx(x + 4, y + sprite.hOnMap);
            return check(tileset1, tileset2, tileset3);
        }


        // if(tile1.img.src.includes('block')){
        //     console.log('a')
        //     if(obj.move_x!==0) {
        //         x = obj.pos_x;
        //     }
        //     if(obj.move_y!==0){
        //         y=obj.pos_y
        //     }
        // }

        return {x:x,y:y};
    }
}

let physicManager = new PhysicManager();
