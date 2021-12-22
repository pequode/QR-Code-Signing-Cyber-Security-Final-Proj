var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth*0.95;
canvas.height = window.innerHeight*0.85;
// intailize global vars
var canvDems = [canvas.width, canvas.height];
var playerSize = 50;
var alumiSize = 50;
var prezSize = 20;
var GameStarted = false;

ctx = canvas.getContext('2d');

function getRandomInt(min,max) {
  return min + Math.floor(Math.random() * max);
}
// used to help determine cost function
function distance(x1,y1,x2,y2){
  var d = Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2))
  if(d==0){
    d = 1;
  }
  return d;
}
// used to determine hit detection on bounds
function INBounds(posX,posY){
  var k = [!(posX>canvas.width||posX<0), !(posY>canvas.height||posY<0)]
  return k;
}
// used to detect hit detection
function checkIntersection (x,y,topx,topy,x1,y1,topx1,topy1){
  rangex = (x1 <=x+topx) && (x1+topx1 >= x)
  rangey = (y <= y1+topy1)&&(y+topy >=y1)
  return  rangex&&rangey;
}
// used to check object intersection
function objectInter(ob1,ob2){
  return checkIntersection(ob1.x,ob1.y,ob1.topx,ob1.topy,ob2.x,ob2.y,ob2.topx,ob2.topy);
}
// creates background class
class background{
    constructor(){
      this.x=0;
      this.y=0;
      this.topx=canvas.width;
      this.topy=canvas.height;
      this.sprite = new Image();
      this.sprite.src = "./images/BUmap.png";
      this.cashimg = new Image();
      this.cashimg.src = "./images/cash.png"
      this.OtherCash =[];
    }
    // draws HUD
    draw(ctx,player){
      var str = "Tuition: "+ player.tuition.toString();
      var str1 = "Semester Payment: "+ player.dropAmt.toString();
      ctx.fillStyle = "black";
      ctx.font = "30px Arial";

      ctx.drawImage(this.sprite,this.x,this.y,this.topx, this.topy);
      ctx.fillText(str, 10, 20);
      ctx.fillText(str1, 10, 50);

      var cashScaleFactor = 5;
      var n = player.moneyDrops.length;
      var CashInPlay = (n>0);
      var i = 0;
      // checks all player money drop locations
      for (i=0;i<n;i++){
        var k = player.moneyDrops[i];
        ctx.drawImage(this.cashimg,k[0], k[1], k[2]*cashScaleFactor, k[2]*cashScaleFactor);
      }

      n = this.OtherCash.length;
      i = 0;
      // checks all other cash locations
      for (i=0;i<n;i++){
        var k = this.OtherCash[i];
        ctx.drawImage(this.cashimg,k[0], k[1], k[2], k[2]);
      }
      // checks for end game
      if(!CashInPlay&&player.tuition<5){
        player.alive=false;
      }

    }
}
// inherited class for most object
class movingObject{
  constructor(id,x,y,xwid,ywid,imgsrc) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.topx = xwid;
    this.topy = ywid;
    this.imgSrc = imgsrc;
    this.sprite = new Image();
    this.sprite.src =this.imgSrc;
  }
  draw(ctx){
      ctx.drawImage(this.sprite,this.x, this.y, this.topy, this.topx);
  }
}
// Alumni is a object that drops cash to make the game harder
class Alumi extends movingObject {
  constructor(id) {
    var sidex= getRandomInt(1,2);
    var sidey= getRandomInt(1,2);
    super(id,
          ((sidex==1)? 0: canvDems[0]),
          ((sidey==1)? 0: canvDems[1]),
          alumiSize,
          alumiSize,
          "./images/alumniGame.png"
        );
    var diry = ((sidey==1)? 1: -1);
    var dirx = ((sidex==1)? 1: -1);
    this.speedy = diry*getRandomInt(1,5);
    this.speedx = dirx*getRandomInt(1,5);
    this.dropInterval =getRandomInt(5,20);
    this.donations = getRandomInt(5,20);
    this.count = 0;
    this.in = true
  }
  // randomly drop cash in a line
  dropAndDash(back){
    var k = INBounds(this.x,this.y)
    var inbounds = k[0]&&k[1];
    if (inbounds){
      if(this.count%this.dropInterval==0&&this.count<100){
        var middle = this.donations/2;
        back.OtherCash.push([this.x+middle,this.y+middle,this.donations]);
      }
      this.x +=this.speedx;
      this.y +=this.speedy;
      this.count+=1;
   }
   else{
     this.inbounds = false;
     this.x=-100;
     this.y= -100;
   }
  }
}
// player object
class player extends movingObject{
  constructor(speed,id,startx,starty) {
    super(id,
          startx,
          starty,
          playerSize,
          playerSize*2,
          "./images/playerGame.png"
    );
    this.speed = speed;
    this.tuition = 100
    this.dropAmt = 10;
    this.alive = true;
    this.moneyDrops = [];
  }
  // given on key press
  moveVert(dir){
      if(dir==-1){
        if(this.y - this.speed > 0){
          this.y = this.y-this.speed;
        }
      }
      else if(dir==1){
        if((this.y + this.speed+this.topy <canvDems[1])){
          this.y = this.y+this.speed;
        }
      }


  };
  // given on key press
  moveHorz(dir){
      if(dir==-1){
        if(this.x - this.speed > 0){
          this.x = this.x-this.speed;
        }
      }
      else if(dir==1){
        if((this.x + this.speed+this.topx <canvDems[0])){
          this.x = this.x+this.speed;
        }
      }
  };
  // given on key press
  dropCash(){
    var i = 0;
    var val = [0,0,0]
    if( this.tuition >= this.dropAmt && this.dropAmt >0 ){
        val = [this.x+this.topy/2,this.y+this.topx/2,this.dropAmt]
        this.tuition -=this.dropAmt;
        this.moneyDrops.push(val);
    }
  };

  increaseDrop(){
    if(this.dropAmt<this.tuition){
      this.dropAmt+=5;
    }
  };
  decreaseDrop(){
    if(this.dropAmt>0){
      this.dropAmt-=5;
    }
  };
}
// class for the main enemy
class pressBrown extends movingObject{
  constructor(speed,id,startx,starty) {
    super(id,
          startx,
          starty,
          prezSize,
          prezSize,
          "./images/pbrown.gif"
    );
    this.speed = speed;
    this.starting = 100
    this.burgerFund = this.starting;
    this.justPayed = false;
    this.alive = true;
  }
  // the boss will chase all the dropped cash
  // The boss will compair distance to the cash/amount of cash will head to the lowest value
  // if the boss intersects the cash, reremoves it and inceases his health
  gobbleGobble(players,back){
    var amt = [this.topx/2,this.topy/2];
    var min = [1000,500,500];

    var i =0;
    var n = players.moneyDrops.length;
    for(i=0;i<n;i++){
      var k = players.moneyDrops[i];
      if(
        checkIntersection(this.x,this.y,this.topx,this.topy,
                          k[0],k[1],    k[2],     k[2])
        ){
          if(i<n-1){players.moneyDrops.splice(i,1)}
          else{players.moneyDrops.pop()}
          var growth = Math.sqrt(k[2]);
          this.topx += growth;
          this.topy += growth;
          this.burgerFund += k[2];
          break;
        }
      else{
          var dis = distance(this.x+this.topx/2,this.y+this.topy/2,
                             k[0]+k[2]/2,       k[1]+k[2]/2)
          dis = dis/k[2];
          if(min[0]>dis && k[0]!=-1){
            min = [dis,k[0],k[1]]
          }
      }
    }

    i =0;
    n = back.OtherCash.length;
    for(i=0;i<n;i++){
      var k = back.OtherCash[i];
      if(
        checkIntersection(this.x,this.y,this.topx,this.topy,
                          k[0],  k[1],  k[0]+k[2],k[1]+k[2])
        ){
          if(i<n-1){back.OtherCash.splice(i,1)}
          else{back.OtherCash.pop()}
          var growth = Math.sqrt(k[2]);
          this.topx += growth;
          this.topy += growth;
          this.burgerFund += k[2];
          break
        }
      else{
        var dis = distance(this.x+this.topx/2,this.y+this.topy/2,
                       k[0]+k[2]/2,       k[1]+k[2]/2)
        dis = dis/k[2];
        if(min[0]>dis && k[0]!=-1){
          min = [dis,k[0],k[1]]
        }
      }
    }

    if(min[0] != 1000 ){

        if (this.x-min[1]> 0 && INBounds(this.x-this.speed)){
          this.x= this.x-this.speed;
        }
        else if (INBounds(this.x+this.speed)){
          this.x= this.x+this.speed;
        }

        if (this.y-min[2]> 0 && INBounds(this.x-this.speed)){
          this.y= this.y-this.speed;
        }
        else if (INBounds(this.y+this.speed)){
          this.y= this.y+this.speed;
        }
    }
  }
  // if the boss steps on student protesters he loses money
  losingMoney(fuckUp){
     if(checkIntersection(this.x,this.y,this.topx,this.topy,fuckUp.x,fuckUp.y,fuckUp.topx,fuckUp.topy) ){
        this.justPayed = true;
        var cost = Math.sqrt(fuckUp.cost)
        if(this.topx>prezSize)
          {this.topx -= cost/2;
          this.topy -= cost/2;
          }
        this.burgerFund -= fuckUp.cost;
        if(this.burgerFund<0){
          this.alive = false;
          }
      }
     else {
       this.justPayed = false;
     }
  }
  //draws the president with a health bar
  drawprez(ctx){
    this.draw(ctx)
    //lost Health =

    var xstart = this.x-10;
    var xend = this.x+this.topx+20;
    var width = xend-xstart

    var amountLost = (this.starting-this.burgerFund)/this.starting
    var redwidth = width*amountLost;
    var redwidth = (redwidth<0)?0:redwidth;
    var greenwidth = width-redwidth;
    //draw red
    ctx.fillStyle = "red";
    ctx.fillRect(xstart+greenwidth, this.y-this.topy ,redwidth,5);
    //draw green
    var amountover = (this.starting-this.burgerFund)/this.starting
    amountover = (amountover<0)?-1*amountover+1:1;
    greenwidth = greenwidth*amountover
    ctx.fillStyle = "green";
    ctx.fillRect(xstart, this.y-this.topy,greenwidth,5);
    //draw black
    ctx.fillStyle = "black";
    ctx.fillRect(xstart+width, this.y-this.topy,3,5);
  }
}
// class for the student protesters
class PresFuckUps extends movingObject{
  constructor(size,x,y){
    super(2000,
          x,
          y,
          size,
          size,
          "./images/protesters.png"
    );
    this.cost = 5;
  }
}
// initate all the objects
const back = new background();
var padding = playerSize + 10;
const player1 = new player(10,0,canvDems[0]/2,canvDems[1]/2);
const pressBrown1 = new pressBrown(2,1,0,canvDems[1]/2);
const Alum1 = new Alumi(3);
const Covid = new PresFuckUps(getRandomInt(20,50),getRandomInt(0+padding,canvDems[0]-padding),getRandomInt(0+padding,canvDems[1]-padding))
function drawEndGame(ctx,gameState){
  var str = "";
  var centver = 300;
  if(gameState[1]==1){
    ctx.fillStyle = "green";
    var str1 ="WIN";
    var str2 = "You caught Prez Brown in hypocrisy!";
    var monLeft = (100-player1.tuition)
    var str3 = "It only cost:" + "$"+monLeft.toString()+"k...";
    ctx.fillRect(0, 0, canvDems[0],canvDems[1]);
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(str1, canvDems[0]/2 - 200,centver+ 10 );
    ctx.fillText(str2, canvDems[0]/2 - 200,centver+40);
    ctx.fillText(str3, canvDems[0]/2 - 200,centver+70);
    ctx.fillText("R to reload", canvDems[0]/2 - 200,centver+100);
  }
  else{
    ctx.fillStyle = "red";
    var str1 = "LOSE:";
    var str2 = "You graduated with a Bachelor degree!";
    var str3 = "Now to find old Newspapers to sleep under...";
    ctx.fillRect(0, 0, canvDems[0],canvDems[1]);
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";

    ctx.fillText(str1, canvDems[0]/2 - 200,centver+ 10 );
    ctx.fillText(str2, canvDems[0]/2 - 200,centver+40);
    ctx.fillText(str3, canvDems[0]/2 - 200,centver+70);
    ctx.fillText("R to reload", canvDems[0]/2 - 200,centver+100);
  }



}
function drawStart(ctx){
  var centver = 300;
  ctx.fillStyle = "grey";
  var str1 ="President Brown's Burger Fund.";
  var str2 = "President brown is after your tuition! Press {space} to lead him";
  var str3 = "to step on student protesters so that he's exposed.";
  ctx.fillRect(0, 0, canvDems[0],canvDems[1]);
  ctx.fillStyle = "black";
  ctx.font = "40px bold Arial";
  ctx.fillText(str1, canvDems[0]/2 - 200,centver+ 10 );
  ctx.font = "20px Arial";
  ctx.fillText(str2, canvDems[0]/2 - 200,centver+40);
  ctx.fillText(str3, canvDems[0]/2 - 200,centver+70);
  ctx.fillText("{x} to increaseDrops {z} to decreaseDrop. {s} to start", canvDems[0]/2 - 200,centver+100);
  ctx.fillText("{arrow keys} to move and restart at any time with {r}. Enjoy!", canvDems[0]/2 - 200,centver+130);
}

var gameOver = [false,0];

function update(){
  if(!gameOver[0]){
    back.draw(ctx,player1)
    pressBrown1.drawprez(ctx);
    Alum1.draw(ctx);
    player1.draw(ctx);
    Covid.draw(ctx);
    if(Alum1.in){Alum1.dropAndDash(back);}
    pressBrown1.gobbleGobble(player1,back);
    pressBrown1.losingMoney(Covid);
    gameOver[0] = !pressBrown1.alive||!player1.alive;

  }
  else{
    if (pressBrown1.alive){
      gameOver[1] = -1;
    }
    else{
      gameOver[1] = 1;
    }
    drawEndGame(ctx,gameOver);
  }
}
// this is done to take user inputs
document.onkeydown = function (event) {
      switch (event.keyCode) {
         case 83:
            GameStarted=true;
            break;
         case 32:
            player1.dropCash();
            break;
         case 37:
            player1.moveHorz(-1);
            break;
         case 38:
            player1.moveVert(-1);
            break;
         case 39:
            player1.moveHorz(1);
            break;
         case 40:
            player1.moveVert(1);
            break;
         case 82:
            window.location.reload(true);
            break;
         case 90:
               player1.decreaseDrop();
               break;
         case 88:

               player1.increaseDrop();
               break;
      }

};
// update every 30 milliseconds.  
const run = setInterval(function() {
  if(GameStarted){
    update();
  }
  else{
    drawStart(ctx)
  }}, 30);
