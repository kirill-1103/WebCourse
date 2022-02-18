class GameManager{
    factory={};
    entities = [];
    fireNum = 0;
    player = null;
    laterKill = [];
    mapManager = mapManager;
    spriteManager = spriteManager;
    eventsManager = eventsManager;
    physicManager = physicManager;
    mainSoundManager = new SoundManager();
    soundManager = soundManager;

    gameOverFlag=false;
    winFlag=false;
    canvas=null;
    interval=null;
    pathMap=null;
    timeStart=null;
    lastTime = null;
    time = 0;
    score_total=0;

    start(){

    }


    initPlayer(obj) {
        this.player = obj;
        this.player.move_y = 0;
        if (localStorage['level'] == 2) {
            this.player.score = 10000;
        }
    }
    kill(obj){
        this.laterKill.push(obj);
    }
    update(ctx){
        this.setTime();


        if(this.player===null){
            return;
        }
        this.player.move_x=0;
        if(eventsManager.action['up']){
            if(this.player.onGround) {
                this.player.move_y = -4;
                soundManager.play('../sounds/JUMP.mp3')
            }
            this.player.onGround =false;
        }
        if(eventsManager.action['right']){
            this.player.move_x=1;
        }
        if(eventsManager.action['left']){
            this.player.move_x=-1;
        }

        // if(eventsManager.action['down']){
        //     this.player.move_y=1
        // }
        if(eventsManager.action['fire']){
            this.player.fire();
        }
        physicManager.update(this.player);
        for(let i of this.entities){
            if(i.update) {
                i.update();
            }
        }
        for(let i = 0 ;i<this.laterKill.length;i++){
            let idx = this.entities.indexOf(this.laterKill[i]);
            if(idx>-1){
                this.entities.splice(idx,1);
            }
        }
        if(this.laterKill.length>0){
            this.laterKill.length=0;
        }
        mapManager.draw(ctx);
        this.draw(ctx);
        this.setScore();
    }
    draw(ctx){
        for(let i of this.entities){
            i.draw(ctx);
        }
    }
    loadAll(canvas,pathMap){
        this.gameOverFlag = false;
        this.pathMap=pathMap;
        let pathAtlas = '../sprites/sprites.json';
        let pathImg = '../sprites/spritesheet.png';
        mapManager.loadMap(pathMap);
        this.canvas=canvas;
        eventsManager.setup(canvas);
        spriteManager.loadAtlas(pathAtlas,pathImg);

        this.mainSoundManager.init();
        this.mainSoundManager.loadArray(['../sounds/main.mp3']);
        this.mainSoundManager.play('../sounds/main.mp3',{volume:0.1,looping:true});

        this.soundManager.init();
        this.soundManager.loadArray(['../sounds/coin.mp3','../sounds/JUMP.mp3',
        '../sounds/boom.mp3','../sounds/fire.mp3','../sounds/lose.mp3',
       '../sounds/win.mp3','../sounds/empty.mp3']);

        this.factory['player'] = ()=>{return new Player()};
        this.factory['enemy'] = ()=>{return new Enemy()};
        this.factory['coin'] = ()=>{return new Coin()};
        this.factory['fire'] = ()=>{return new Fire()};
        this.factory['bomb'] = ()=>{return new Bomb()};
        this.factory['finish'] = ()=>{return new Finish()};
        mapManager.parseEntities();


        let size;
        let interval = setInterval(
            ()=> {
                size = this.getSize();
                if (size.x !== undefined) {
                    next();
                    clearInterval(interval);
                }
            },100)

        let mm=this;
        function next(){
            canvas.style.width='1300px';
            canvas.style.height='600px';
            canvas.width = size.x;
            canvas.height = size.y;
            let context = canvas.getContext('2d');

            mapManager.draw(context);
            mm.draw(context);
        }


    }

    getSize(){
        let x,y;
        if (mapManager.mapSize.x !== 32) {
            x = mapManager.mapSize.x;
            y = mapManager.mapSize.y;
        }
        return {x:x,y:y};
    }

    play(canvas){
        this.initTime();
        let context = canvas.getContext('2d');
        this.interval = setInterval(()=>{this.update(context)},31);
    }
    gameOver(obj){
        this.gameOverFlag=true;
        clearInterval(this.interval)

        setTimeout(()=>{
            if(obj===null){
                document.getElementById('info_h3').innerHTML = 'У вас закончились средства!'
            }else if(obj.name==='enemy'){
                document.getElementById('info_h3').innerHTML = 'Вас съели свиньи! '
            }else{
                document.getElementById('info_h3').innerHTML = 'Вы сгорели на костре! '
            }

            document.getElementById('score_h').innerHTML = '';
            let modal = document.getElementById('modal');
            modal.style.display = 'block';
        },1000)
        this.soundManager.play('../sounds/lose.mp3',{volume:0.2});
        this.mainSoundManager.stop(0);
    }
    win(){
        this.winFlag=true;
        this.gameOverFlag=true;
        clearInterval(this.interval);

        setTimeout(()=>{
            document.getElementById('info_h3').innerHTML = 'Вы победили монстров! '
            document.getElementById('score_h').innerHTML = `Количество очков: ${this.score_total}`;
            let modal = document.getElementById('modal');
            modal.style.display = 'block';
            this.updateRecords();
        },100);
        this.soundManager.play('../sounds/win.mp3',{volume:0.2});
        this.mainSoundManager.stop(0);
    }
    next(){
        // if(this.winFlag && localStorage['level']==1){
        //     localStorage['level']=2;
        //     document.location.href='../kurs0/index.html';
        // }
    }

    pause(){
        if(!this.gameOverFlag) {
            clearInterval(this.interval);
        }
    }

    initTime(){
        this.lastTime = new Date();
        if(!this.timeStart) {
            this.timeStart = this.lastTime;
        }
    }

    setTime(){
        let currentTime = new Date();
        this.time += currentTime-this.lastTime;
        this.lastTime=currentTime;
        let time = document.getElementById('time_p');
        let minutes = Math.floor((this.time/1000/60)<<0);
        let seconds = Math.floor((this.time/1000)%60);
        let ms = Math.floor((this.time - minutes*60000 - seconds*1000)/10);

        let minStr = minutes>9?minutes:'0'+minutes;
        let secStr = seconds>9?seconds:'0'+seconds;
        let msStr  = ms>9?ms:'0'+ms;

        // let milli  = (this.time)-this.time
        time.innerHTML = `Время: ${minStr}:${secStr}:${msStr}`
    }

    setScore(){
        let score = document.getElementById('score_p');
        this.score_total = Math.floor(this.player.score -= 1);
        score.innerHTML = `Количество очков: ${this.score_total}`
        if(this.score_total<0){
            this.gameOver(null);
        }
    }

    updateRecords(){
        let lvl = localStorage['level'];
        for(let i = 0 ;i<10;i++){
            let rec =localStorage[`lvl${lvl}rec${i+1}`];
            if(rec.includes('---')){
                localStorage[`lvl${lvl}rec${i+1}`] = this.score_total;
                localStorage[`lvl${lvl}name${i+1}`]=localStorage['player'];
                break;
            }else{
                if(parseInt(rec)<=this.score_total){
                    shift(i);
                    localStorage[`lvl${lvl}rec${i+1}`] = this.score_total;
                    localStorage[`lvl${lvl}name${i+1}`]=localStorage['player'];
                    break;
                }
            }
        }
        function shift(index){
            for(let  i = 9;i>index;i--){
                localStorage[`lvl${lvl}rec${i+1}`]=localStorage[`lvl${lvl}rec${i}`];
                localStorage[`lvl${lvl}name${i+1}`]=localStorage[`lvl${lvl}name${i}`];
            }
        }
    }


}

let gameManager = new GameManager();
