const MIN_TIME = 50;
let save_shape;
let needCheckShape = false;

document.addEventListener('keydown',function(event){
    let saveX = xposition;
    switch(event.code){
        case 'ArrowRight':
            xposition++;
            break;
        case 'ArrowLeft':
            xposition--;
            break;
        case 'ArrowUp':
            save_shape = shape.slice(0);
            shape = rotate(shape);
            needCheckShape=true;
            break;
        case 'ArrowDown':
                yposition++;
                if(checkCorrectShapePosition(shape)) {
                    clearTimeout(timeout);
                    timeout = setTimeout(tick, time);
                }else{
                    yposition--;
                }
            break;
    }
    if(!checkCorrectShapePosition(shape)){
        xposition=saveX;
        if((needCheckShape)){
            shape = save_shape.slice(0);
        }
        return;
    }
    if(needCheckShape){
        needCheckShape=false;
    }
    if(event.code === 'ArrowRight' || event.code === 'ArrowLeft' ||
        event.code === 'ArrowUp' || event.code === 'ArrowDown'){
        insertShape(shape,xposition,yposition-height(shape));
        fillField();
    }
})