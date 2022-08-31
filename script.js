var cv, ctx, blackground="white", speed=40, player_Direction="";
var pause=false;
var bomb_flag = false;
//var pl = new Image();
//Other functions
function clear(){
    ctx.fillStyle = blackground;
    ctx.fillRect(0,0,window.innerWidth,window.innerHeight);
}
function random(){
    return  (Math.round(Math.random()) == 1)?true:false;
}
//Principal functions
function run(){
    cv = document.getElementById('mycanvas');
    ctx = cv.getContext('2d');
    //pl.src = '/img/player.png';
    player1 = new Player(0, 0, 40, 40, "red");
    bomb = new Bomb(-40, -40, false);
    //wall = new Block(40,40,40,40,false);
    walls = [];
    blocks = [];
    walls.unshift(new Wall(40,40,40,40));
    blocks.unshift(new Block(80,0,40,40,random()));
    //blocks.unshift(new Block(0,80,40,40,true));
    //Generate walls
    for (let index = 0; index < 8; index++) {
        for (let index = 0; index < 10; index++) {
            if (walls[0].x <= 640) {
                walls.unshift(new Wall(walls[0].x+80, walls[0].y, 40, 40));
            }else{
                walls.unshift(new Wall(40, walls[0].y+80, 40, 40));
            }
        }
    }
    //Generate blocks
    for (let index = 0; index < 19; index++) {
        for (let index = 0; index < 19; index++) {
            if (blocks[0].x <= 680) {
                blocks.unshift(new Block(blocks[0].x+40, blocks[0].y, 40, 40, random()));
            }else if(blocks[0].y == 0 && blocks[0].x > 680 ){
                blocks.unshift(new Block(80, blocks[0].y+40, 40, 40, random()));
            }else{
                blocks.unshift(new Block(0, blocks[0].y+40, 40, 40, random()));
            }
        }
    }
    //Validate blocks
    for (let index = 0; index < walls.length; index++) {
        for (let index2 = 0; index2 < blocks.length; index2++) {
            if (walls[index].x == blocks[index2].x && walls[index].y == blocks[index2].y) {
                blocks[index2].v = false;
            }
        }
    }
    paint();
}
function paint(){
    window.requestAnimationFrame(paint);
    clear()
    //ctx.drawImage(pl, player1.x, player1.y);
    //ctx.drawImage(aceite, player2.x, player2.y);
    for (let index = 0; index < blocks.length; index++) {
        blocks[index].paint(ctx);
    }
    for (let index = 0; index < walls.length; index++) {
        walls[index].paint(ctx);
    }
    player1.paint(ctx);
    bomb.paint(ctx, player1);
    /*for (let index = 0; index < pared.length; index++) {
        ctx.drawImage(poste, pared[index].x, pared[index].y);
    }
    ctx.fillStyle = "black";
    ctx.fillText("SCORE: "+score,440,10);*/
    if(pause){
        ctx.fillStyle = "rgba(0,0,0,0.5)";
        ctx.fillRect(0,0,760,760);
        ctx.fillStyle = "white";
        ctx.fillText("Pause",245,250);
    }else{
        update();
    }
}
function update(){ 
    //Validation move
    if(player1.x > 720){player1.x = 720;}
    if(player1.x < -1){player1.x = 0;}
    if(player1.y > 720){player1.y = 720;}
    if(player1.y < 0){player1.y = 0;}
    //Move player
    if(player_Direction=="right"){player1.x+=speed;bomb_flag=true;}
    if(player_Direction=="left"){player1.x-=speed;bomb_flag=true;}
    if(player_Direction=="down"){player1.y+=speed;bomb_flag=true;}
    if(player_Direction=="up"){player1.y-=speed;bomb_flag=true;}
    //Validation collision
    for (let index = 0; index < walls.length; index++) {
        if(player1.collision(walls[index])){
            if(player_Direction=="right"){player1.x-=speed;bomb_flag=false;}
            if(player_Direction=="left"){player1.x+=speed;bomb_flag=false;}
            if(player_Direction=="down"){player1.y-=speed;bomb_flag=false;}
            if(player_Direction=="up"){player1.y+=speed;bomb_flag=false;}
        }
    }
    for (let index = 0; index < blocks.length; index++) {
        if(player1.collision(blocks[index]) && blocks[index].v == true){
            if(player_Direction=="right"){player1.x-=speed;bomb_flag=false;}
            if(player_Direction=="left"){player1.x+=speed;bomb_flag=false;}
            if(player_Direction=="down"){player1.y-=speed;bomb_flag=false;}
            if(player_Direction=="up"){player1.y+=speed;bomb_flag=false;}
        }
    }
    player_Direction="";
}
document.addEventListener('keydown', (e)=>{
    //left
    if (e.keyCode == 65 || e.keyCode == 37) {
        player_Direction = "left";bomb_Direction = "left";
    }
    //down
    if (e.keyCode == 83 || e.keyCode == 40) {
        player_Direction = "down";bomb_Direction = "down";
    }
    //right
    if (e.keyCode == 68 || e.keyCode == 39) {
        player_Direction = "right";bomb_Direction = "right";
    }
    //up
    if (e.keyCode == 87 || e.keyCode == 38) {
        player_Direction = "up";bomb_Direction = "up";
    }
    //space bar
    if(e.keyCode == 32){
        if(bomb_flag && !bomb.v){
            bomb.create_bomb(ctx, player1.x, player1.y);
        }
        setTimeout(function(){
            for (let index = 0; index < blocks.length; index++) {
                if (blocks[index].v) { 
                    bomb.collision(blocks[index]);
                    if(bomb.collision(player1)){
                        console.log("morido");
                    };
                }
            }
            bomb.explosion(ctx);
            bomb.v=false;
            bomb.delete_bomb(ctx);
        }, 2000);
    }
    //pause
    if(e.keyCode == 13){
        pause = (!pause)?true:false;
    }
});
window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 17);
    };
}());
window.addEventListener("load", run, false);
function Block(x, y, w, h, v){
    this.x = x;this.y = y;
    this.w = w;this.h = h;
    this.c = "brown";
    this.v = v;
    this.paint = function paint(ctx){
        if(this.v){
            ctx.strokeRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle=this.c;
            ctx.fillRect(this.x, this.y, this.w, this.h);
        }
    };
}
function Wall(x, y, w, h){
    this.x = x;this.y = y;
    this.w = w;this.h = h;
    this.c = "gray";
    this.paint = function paint(ctx){
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle=this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}
function Bomb(x, y){
    this.x = x;this.y = y;
    this.w = 40;this.h = 40;
    this.c = "black";
    this.v = false;
    this.paint = function(ctx){
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle=this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };
    this.create_bomb = function(ctx, x, y){
        this.x = x; this.y = y;
        console.log(this.x + "-" + this.y);
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle=this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };
    this.delete_bomb = function(ctx){
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle=this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
        this.x = -80;
        this.y = -80;
    };
    this.collision = function(target) {
        if ((this.x+40 == target.x && this.y == target.y)/*||
            this.x+80 == target.x && this.y == target.y*/) {
            //console.log("right");
            target.v = false;
            return true;
        }else if((this.x-40 == target.x && this.y == target.y)/*||
                this.x-80 == target.x && this.y == target.y*/){
            //console.log("left");
            target.v = false;
            return true;
        }else if((this.x == target.x && this.y+40 == target.y)/*||
                this.x == target.x && this.y+80 == target.y*/){
            //console.log("down");
            target.v = false;
            return true;
        }else if((this.x == target.x && this.y-40 == target.y)/*||
                this.x == target.x && this.y-80 == target.y*/){
            //console.log("up");
            target.v = false;
            return true;
        }else{
            return false;
        }
    };
    this.explosion = function(ctx){
        console.log(this.x + "-" + this.y);
        ctx.strokeRect(this.x-40, this.y, this.w+80, this.h);
        ctx.fillStyle="green";
        ctx.fillRect(this.x-40, this.y, this.w+80, this.h);
        ctx.strokeStyle="black";
        ctx.strokeRect(this.x, this.y-40, this.w, this.h+80);
        ctx.fillStyle="orange";
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

function Player(x, y, w, h, c){
    this.x = x;this.y = y;
    this.w = w;this.h = h;
    this.c = c;
    this.paint = function(ctx){
        ctx.strokeRect(this.x, this.y, this.w, this.h);
        ctx.fillStyle=this.c;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    };
    this.collision = function (target) { 
        if(this.x < target.x + target.w &&
            this.x + this.w > target.x && 
            this.y < target.y + target.h && 
            this.y + this.h > target.y){
                return true;
        }
    }
}