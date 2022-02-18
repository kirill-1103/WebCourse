let main_canvas = document.getElementById("main_canvas");
let context_mc  = main_canvas.getContext('2d');
let div_main_canvas = document.getElementById("div_main_canvas");

main_canvas.width = div_main_canvas.clientWidth;
main_canvas.height = div_main_canvas.clientHeight-100;


let block_width = Math.round(Math.min(main_canvas.width/10,main_canvas.height/20));
let block_height =block_width;


const FALLEN_COLOR  = 'pink';

const WIDTH_FIELD = 10;
const HEIGHT_FIELD = 20;

function drawBlock(x,y,color){
    x=x*block_width;
    y=y*block_height;
    context_mc.strokeStyle = 'black';
    context_mc.strokeRect(x,y,block_width,block_height);
    context_mc.fillStyle =  color;
    context_mc.fillRect(x+1,y+1,block_width-2,block_height-2);
    //context_mc.fillRect(x,y,block_width,block_height);
    context_mc.stroke();
 }

function fillField(){
    for(let i = 0 ;i<HEIGHT_FIELD;i++){
        for(let j = 0; j<WIDTH_FIELD;j++){
            if(array_field[i][j]===0) {
                drawBlock(j, i, STANDARD_COLOR);
            }
            if(array_field[i][j]>=1 && array_field[i][j]<=8 && array_field[i][j]!==2){

                switch(array_field[i][j]){
                    case 1:
                        drawBlock(j, i, FALLING_COLOR_1);
                        break;
                    case 3:
                        drawBlock(j, i, FALLING_COLOR_3)
                        break;
                    case 4:
                        drawBlock(j, i, FALLING_COLOR_4);
                        break;
                    case 5:
                        drawBlock(j, i, FALLING_COLOR_5);
                        break;
                    case 6:
                        drawBlock(j, i, FALLING_COLOR_6);
                        break;
                    case 7:
                        drawBlock(j, i, FALLING_COLOR_7);
                        break;
                    case 8:
                        drawBlock(j, i, FALLING_COLOR_8);
                        break;
                }
            }
            if(array_field[i][j]===2){
                drawBlock(j,i,FALLEN_COLOR);
            }
        }
    }
}
fillField()

document.addEventListener("DOMContentLoaded",function(event){
   window.onresize = function(){
       resize();
    }
});

function resize(){
    main_canvas.width = div_main_canvas.clientWidth;
    main_canvas.height = div_main_canvas.clientHeight-100;


    block_width = Math.round(Math.min(main_canvas.width/10,main_canvas.height/20));
    block_height =block_width;
    fillField();
}
