class SpriteManager{
    image = new Image();
    sprites = [];
    imgLoaded = false;
    jsonLoaded = false;

    loadAtlas(atlasJson,atlasimg){
        let request = new XMLHttpRequest();
        request.onreadystatechange = ()=>{
            if(request.readyState === 4 && request.status===200){
                this.parseAtlas(request.responseText);
            }
        }
        request.open('GET',atlasJson,true);
        request.send();
        this.loadImg(atlasimg);
    }

    parseAtlas(atlasJSON){
        let atlas = JSON.parse(atlasJSON);
        for(let name in atlas.frames){
            let frame = atlas.frames[name].frame;
            this.sprites.push({name:name,x:frame.x,y:frame.y,w:frame.w,h:frame.h,wOnMap:frame.w*1.4,hOnMap:frame.h*1.4});
        }
        this.jsonLoaded=true;
    }

    loadImg(imgName){
        this.image.onload = ()=>{
            this.imgLoaded = true;
        }
        this.image.src=imgName;
    }

    drawSprite(ctx,name,x,y,flagReverse){
        if(!this.imgLoaded || !this.jsonLoaded){
            setTimeout(()=>{
                this.drawSprite(ctx,name,x,y);
            },100);
        }else{
            try {
                let sprite = this.getSprite(name);
                // console.log('name:',name,'w:',sprite.w,'h:',sprite.h)
                // let img = new Image();
                // img.src='../sprites/black.jpeg'
                // ctx.drawImage(img, 0, 0, sprite.w, sprite.h, x, y, sprite.wOnMap, sprite.hOnMap);
                if(flagReverse){
                    ctx.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, x*-1-sprite.wOnMap, y, sprite.wOnMap, sprite.hOnMap);
                }else{
                    ctx.drawImage(this.image, sprite.x, sprite.y, sprite.w, sprite.h, x, y, sprite.wOnMap, sprite.hOnMap);
                }

                // ctx.drawImage()
            }catch(e){
                console.log(e)
                console.log(name);
            }
        }
    }

    getSprite(name){
        for (let i of this.sprites){
            if(i.name===name){
                return i;
            }
        }
        return null;
    }


}

let spriteManager = new SpriteManager();
