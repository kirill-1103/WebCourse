const assert  = require('assert');
const findIndexByName = require("../routes/index").findIndexByName;
const getMyPicturesIndexes = require('../routes/users').getMyPicturesIndexes;
const getSecondsFromString = require('../bin/www').getSecondsFromString;
const getStrTimeFromSeconds = require('../bin/www').getStrTimeFromSeconds;
let participants = [{"id":0,"name":"Kirill","money":500,"pictures":[1,2]},{"id":1,"name":"Alex","money":9800,"pictures":[41]},{"id":2,"name":"Andrew","money":"8101","pictures":[]},{"id":3,"name":"Vasiliy","money":31000,"pictures":[]},{"id":5,"name":"Sergey","money":"38124","pictures":[]},{"id":7,"name":"Mihail","money":"15000","pictures":[]},{"id":8,"name":"Leha","money":"33333","pictures":[]},{"id":10,"name":"Dima","money":"23000","pictures":[]},{"id":11,"name":"Serge","money":"19230","pictures":[]},{"id":12,"name":"Vitaliy","money":"24010","pictures":[]},{"id":4,"name":"Nataly","money":"13410","pictures":[]}];
let pictures = [{"id":1,"src":"../../images/1.jpg","name":"Диптих Мэрилин ","author":"Энди Уорхол","start_price":"6000","min_step":"89","max_step":"1450","in_auction":"on","description":"Полотно было написано сразу после смерти Мэрилин Монро. Энди Уорхол соединил две картины: пятьдесят грубо раскрашенных растиражированных портретов актрисы и точно такую же, но черно-белую. На втором полотне большинство портретов плохо видны или смазаны. Таким образом, художнику удалось показать облик смерти, преследовавший Мэрилин, и подчеркнуть контраст с ее жизнью.","buy":"Kirill","temp_price":6050,"buyer":"Kirill"},{"id":2,"src":"../../images/2.jpg","name":"Писто","author":"Энди Уорхол","start_price":"3400","min_step":"100","max_step":"500","description":"3 июня 1968 года Энди Уорхол пережил покушение на свою жизнь – он получил три пулевых ранения в живот. Близкая встреча со смертью вдохновила новатора поп-арта на создание нескольких картин, в том числе и знаменитого «Пистолета» – копией револьвера, из которого он чуть не был застрелен. На красном фоне изображено трафаретное изображение револьвера в черном и белом цветовых решениях.","in_auction":"on","buy":"Kirill","temp_price":3450,"buyer":"Kirill"},{"id":3,"src":"../../images/3.jpg","name":"Крик","author":"Эдвард Мунк","start_price":"4300","min_step":"200","max_step":"650","description":"«Крик» стал ключевым экспрессионистским образом, который не только предвосхитил, но и пережил сам стиль, превзойдя в массовом сознании все более поздние его проявления как самого Мунка, так и художников других стран.","buy":"","temp_price":"4300","buyer":"-"},{"id":41,"src":"../../images/41.jpg","name":"200 однодолларовых купюр","author":"Энди Уорхол","start_price":"3150","min_step":"200","max_step":"400","description":"Уорхол рассказывал: «Я попросил несколько моих знакомых предложить темы для моих работ. Наконец одна подруга задала правильный вопрос: «Слушай, а ты сам-то, что больше всего любишь?» Вот так я и начал рисовать деньги!». Энди Уорхол как пропагандист всего, что имеет характер массовости не смог обойти своим вниманием такую привычную для американца вещь, как однодоллоровая купюра. Именно в этой картине он максимально раскрыл тему духовных и материальных ценностей. На картине нет ничего, кроме денег. ","in_auction":"on","buy":"Alex","temp_price":3200,"buyer":"Alex"},{"id":4,"src":"../../images/4.jpg","name":"123","in_auction":"on","author":"123","start_price":"123","min_step":"10","max_step":"11","description":"123","buy":"","temp_price":"123","buyer":"-"}];


describe('Проверка поиска индекса участника по имени',function(){
    it('Поиск по имени Kirill',function(){
        assert.equal(0,findIndexByName('Kirill',participants));
    })
    it('Поиск по имени Andrew',function(){
        assert.equal(2,findIndexByName('Andrew'));
    })
    it('Поиск по имени которого нет',function(){
        assert.equal(-1,findIndexByName('K'));
    })
});

describe('Проверка генерирования массива индексов картин',function(){
    it('Поиск индексов картин у Kirill',function(){
        assert.equal(0,getMyPicturesIndexes(0,participants,pictures)[0]);
        assert.equal(1,getMyPicturesIndexes(0,participants,pictures)[1]);
    })
    it('Поиск индексов картин у Andrew',function(){
        assert.equal(0,getMyPicturesIndexes(2,participants,pictures).length);
    })
    it('Поиск индексов картин у Alex',function(){
        assert.equal(3,getMyPicturesIndexes(1,participants,pictures)[0]);
    })
})

describe('Проверка вычисления количества секунд по строке "mm:ss"', function () {
    it('Проверка для строки "05:03"',function(){
        assert.equal(303,getSecondsFromString("05:03"));
    })
    it('Проверки для неверной строки',function(){
        assert.equal(0,getSecondsFromString('3:1'));
        assert.equal(0,getSecondsFromString('asd'));
    })
    it('Проверка для строки 00:00',function(){
        assert.equal(0,getSecondsFromString('00:00'));
    })
});

describe('Проверка преобразования количества секунд в строку вида "mm:ss"',function(){
    it('Проверка для количества секунд - 4',function(){
        assert.equal("00:04",getStrTimeFromSeconds(4));
    })
    it('Проверка для количества секунд - 124',function(){
        assert.equal('02:04',getStrTimeFromSeconds(124));
    })
    it('Проверка для неверного количества секунд',function(){
        assert.equal('00:00',getStrTimeFromSeconds(-1));
    })
})

