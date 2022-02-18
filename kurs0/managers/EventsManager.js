class EventsManager{
    bind = [];
    action = [];
    setup(canvas){
        this.bind[87]='up';//w
        this.bind[65]='left';//a
        this.bind[83]='down';//s
        this.bind[68] = 'right';//f
        this.bind[32] = 'fire'//space

        // this.bind[38]='up';//w
        // this.bind[37]='left';//a
        // this.bind[83]='down';//s
        // this.bind[39] = 'right';//f
        // this.bind[32] = 'fire'//space

        document.body.addEventListener('keyup',(event)=>{this.onKeyUp(event)});
        document.body.addEventListener('keydown',(event)=>{this.onKeyDown(event)});
        // canvas.addEventListener('click',(event)=>{
        //     // console.log('x:',event.x,'y:',event.y)
        //     // console.log(mapManager.getTilesetIdx(event.x,event.y));
        // })
    }
    onKeyDown(event){
        let action = this.bind[event.keyCode];
        if(action){
            this.action[action]=true;
        }
    }
    onKeyUp(event){
        let action = this.bind[event.keyCode];
        if(action){
            this.action[action] = false;
        }
    }
}

let eventsManager = new EventsManager();
