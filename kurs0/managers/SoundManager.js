class SoundManager{
    clips = {};//звуковые эффекты
    context = null;//аудиоконспект
    gainNode = null;//главный узел
    loaded = false;//все звуки загружены
    sounds = [];

    init(){// инициализация менеджера звука
        this.context = new AudioContext();
        this.gainNode = this.context.createGain
            ? this.context.createGain()
            :this.context.createGainNode();
        this.gainNode.connect(this.context.destination);//подключение к динамикам
    }
    load(path,callback){//загрузка одного аудио
        if(this.clips[path]){
            callback(this.clips[path]);
            return;
        }
        let clip = {path:path,buffer:null,loaded:false};//клип,буфер,загружен
        clip.play = (volume,loop)=>{
            this.play(this.path,{looping:loop?loop:false,volume:volume?volume:1});
        }
        this.clips[path] = clip;
        let request = new XMLHttpRequest();
        request.open('GET',path,true);
        request.responseType = 'arraybuffer';
        request.onload = ()=>{
            try {
                this.context.decodeAudioData(request.response,
                    (buffer) => {
                        clip.buffer = buffer;
                        clip.loaded = true;
                        callback(clip);
                    })
            }catch(e){}
        }
        request.send();
    }


    loadArray(array){//загрузка массива звуков
        for(let i = 0 ;i<array.length;i++){
            this.load(array[i],()=>{
                if(array.length===Object.keys(this.clips).length){//если все звуки готовы
                    for(let sd in this.clips){
                        if(!this.clips[sd].loaded){
                            return;
                        }
                        this.loaded=true;//все звуки загружены
                    }
                }
            })
        }
    }

    play(path,settings){//проигрывание файла
        if(!this.loaded) {//если еще не все загружен
            setTimeout(()=>{this.play(path,settings)},1000);
            return;
        }
        let looping = false;
        let volume=1;
        if(settings){
            if(settings.looping){
                looping=settings.looping;
            }
            if(settings.volume){
                volume=settings.volume;
            }
        }
        let sd = this.clips[path];
        if(sd===null){
            return false;
        }
        let sound = this.context.createBufferSource();
        sound.buffer = sd.buffer;
        sound.connect(this.gainNode);
        sound.loop = looping;
        this.gainNode.gain.value = volume;
        sound.start(0);
        this.sounds.push(sound);

        return true;
    }
    stop(index){
        let sound = this.sounds[index];
        sound.stop(0);

        return true;
    }

}

let soundManager = new SoundManager();
