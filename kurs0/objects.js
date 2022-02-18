class Entity{
    pos_x=0;
    pos_y=0;
    type='';
    name='';
    constructor(x,y,type,name){
        this.name=name;
        this.type=type;
        this.pos_x=x;
        this.pos_y=y;
    }
}

class Player extends Entity{
    score = 400;
    lifetime = 1;
    move_x = 0;
    move_y = 0;
    speed = 1;
    onGround = false;
    run=1;
    spriteName = 'Player';
    bomb = null;
    fl=true;
    ctx=null;
    alreadyKill=false;
    constructor(x,y,type='Player',name='Player',lifetime=1,move_x=0,move_y=0,speed=7) {
        super(x,y,type,name);
        this.lifetime=lifetime;
        this.move_x=move_x;
        this.move_y=move_y;
        this.speed=4;
    }
    draw(ctx){
        if(!this.alreadyKill) {
            this.ctx = ctx;
            let flagReverse = false;
            if (this.move_x !== 0) {
                this.spriteName = 'Player' + 'Run' + this.run;
                if (this.fl) {
                    if (this.run !== 4) {
                        this.run += 1;
                    } else {
                        this.fl = false;
                    }
                } else {
                    if (this.run !== 1) {
                        this.run -= 1;
                    } else {
                        this.fl = true;
                    }
                }
            } else {
                this.spriteName = 'Player';
                this.run = 1;
            }
            if (this.move_x < 0) {
                flagReverse = true;
                ctx.save();
                ctx.scale(-1, 1);
            }
            if (!this.move_y < 0) {
                this.spriteName = 'Player' + 'Jump';
            } else if (this.move_y > 0) {
                this.spriteName = 'Player' + 'Fall';
            }
            spriteManager.drawSprite(ctx, this.spriteName, this.pos_x, this.pos_y, flagReverse)
            ctx.restore();
        }else{

        }
    }
    update(){

    }
    onTouchEntity(obj){
        if(obj.name==='coin'){
            console.log('coin');
            obj.kill();
            this.score+=1000;
            soundManager.play('../sounds/coin.mp3')
        }
        if(obj.name==='enemy' || obj.name==='fire'){
            this.kill(obj);
        }
        if(obj.name==='finish'){
            gameManager.win();
        }
    }
    kill(obj){
        if(!this.alreadyKill) {
            this.alreadyKill=true;
            let i = 1;
            // gameManager.update(this.ctx);
            gameManager.gameOver(obj);
            setTimeout(()=>{},10)
            let inter = setInterval(() => {
                gameManager.update(this.ctx);
                spriteManager.drawSprite(this.ctx, 'PlayerDead' + i, this.pos_x, this.pos_y);
                i++;
                if (i === 5) {
                    clearInterval(inter);
                }
            }, 100)
        }

    }
    fire(){
        let x,y;
        if(this.move_x>0){
            x=this.pos_x+32;
            y=this.pos_y;
        }
        if(this.move_x<0){
            x=this.pos_x-15;
            y=this.pos_y;
        }
        if(this.move_x!==0 ){
            let index = gameManager.entities.findIndex((el,index,array)=>{return el.name==='Bomb'});
            if(index === -1) {
                this.bomb = new Bomb(x, y, 'Bomb', 'Bomb', this.move_x, 0, 10);
                this.bomb.size_x = 32;
                this.bomb.size_y = 32;
                gameManager.entities.push(this.bomb);
                soundManager.play('../sounds/fire.mp3',{volume: 1,looping:false});

            }
        }
    }

}

class Enemy extends Entity{
    lifetime = 1;
    move_x = 0;
    move_y = 0;
    run=1;
    speed = 0;
    spriteName = 'Enemy';

    constructor(x,y,type='Enemy',name='Enemy',lifetime=1,move_x=0,move_y=0,speed=2) {
        super(x,y,type,name);
        this.lifetime=lifetime;
        this.move_y=0;
        this.move_x = -1;
        this.speed=2;
    }

    draw(ctx){
        let flagReverse = false;
        if(this.move_x!==0){
            this.spriteName = 'Enemy'+'Run'+this.run;
            this.run = (this.run%3)+1;
        }else{
            this.spriteName = 'Enemy';
        }
        if(this.move_x>0){
                flagReverse=true;
                ctx.save();
                ctx.scale(-1,1);
        }
        spriteManager.drawSprite(ctx,this.spriteName,this.pos_x,this.pos_y,flagReverse)
        ctx.restore();
    }
    update(){
        physicManager.update(this)
    }
    onTouchEntity(obj){
        if(obj.name==='player'){
            obj.onTouchEntity(this);
        }
    }
    kill(){
        let index = gameManager.entities.findIndex((el,index,array)=>{return el.type===this.type});
        gameManager.entities.splice(index,1);
    }
}

class Bomb extends Entity{
    move_x = 0;
    move_y = 0;
    speed = 10;
    ctx = null;
    onGround=true;
    constructor(x,y,type='Bomb',name='Bomb',move_x=0,move_y=0,speed=0) {
        super(x,y,type,name);
        this.move_x=move_x;
        this.move_y=move_y;
        this.speed=speed;
    }

    draw(ctx){
        spriteManager.drawSprite(ctx,'Bomb',this.pos_x,this.pos_y)
        this.ctx=ctx;
    }
    update(){
        physicManager.update(this);
    }
    onTouchEntity(obj){
        if(obj.name==='enemy'){
            obj.kill();
            let index =  gameManager.entities.findIndex((el,index,arr)=>{return el.name==='player'});
            gameManager.entities[index].score+=500;
            this.kill();
        }
    }
    onTouchMap(idx){

    }
    kill(){
        let index = gameManager.entities.findIndex((el,index,array)=>{return el.name==='Bomb'});
        gameManager.entities.splice(index,1);
        let i = 1;
        let inter = setInterval(()=>{
            spriteManager.drawSprite(this.ctx,'BombBoom'+i,this.pos_x-20,this.pos_y-30);
            i++;
            if(i===5){
                clearInterval(inter);
            }
        },40)
        soundManager.play('../sounds/boom.mp3',{looping:false,volume:1})

    }
}

class Coin extends Entity{
    constructor(x,y,type='Coin',name='Coin') {
        super(x,y,type,name);
    }
    draw(ctx){
        spriteManager.drawSprite(ctx,'Coin',this.pos_x,this.pos_y)
    }
    kill(){
        let index = gameManager.entities.findIndex((el,i,arr)=>{return el.type===this.type});
        gameManager.entities.splice(index,1);
    }
}

class Fire extends Entity{
    constructor(x,y,type='Fire',name='Fire') {
        super(x,y,type,name);
    }
    draw(ctx){
        spriteManager.drawSprite(ctx,'Fire',this.pos_x,this.pos_y)

    }
    kill(){

    }
}

class Finish extends Entity{
    constructor(x,y,type,name) {
        super(x,y,type,name);
    }
    draw(ctx){
        spriteManager.drawSprite(ctx,'Finish',this.pos_x,this.pos_y)
    }
}
