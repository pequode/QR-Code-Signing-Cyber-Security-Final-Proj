var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth*0.95;
canvas.height = window.innerHeight*0.85;
var canvDems = [canvas.width, canvas.height];
var playerSize = 50;
var alumiSize = 30;
var prezSize = 20;


var pmoneyLocations = [...Array(20)].map(e => Array(3));
var amoneyLocations = [...Array(50)].map(e => Array(3));

cashimg = new Image();
cashimg.src = "cash.png"
background = new Image();
background.src = "BUmap.gif"
var i = 0;
for(i=0;i<20;i++){
  pmoneyLocations[i] = [-1,-1,-1];
}
for(i=0;i<50;i++){
  amoneyLocations[i] = [-1,-1,-1];
}

function getRandomInt(min,max) {
  return min + Math.floor(Math.random() * max);
}
function distance(x1,y1,x2,y2){

  var d = Math.sqrt(Math.pow((x1-x2),2)+Math.pow((y1-y2),2))
  if(d==0){
    d = 1;
  }
  return d;
}
function INBounds(posX,posY){
  var k = [!(posX>canvas.width||posX<0), !(posY>canvas.height||posY<0)]
  return k;
}
function checkIntersection (x,y,topx,topy,x1,y1,topx1,topy1){
  rangex1 = (x1>x && x1 <x+topx) || (x>x1 && x <x1+topx1)
  rangey1 = (y1>y && y1 <y+topy) || (y>y1 && y <y1+topy1)
  return  rangex1&&rangey1;
}
function objectInter(ob1,ob2){
  return checkIntersection(ob1.x,ob1.y,ob1.topx,ob1.topy,ob2.x,ob2.y,ob2.topx,ob2.topy);
}
class Alumi {
  constructor(id) {
    var sidex= getRandomInt(1,2);
    var sidey= getRandomInt(1,2);
    this.y =((sidey==1)? 0: canvDems[1]);
    this.x =((sidex==1)? 0: canvDems[0]);
    var diry = ((sidey==1)? 1: -1);
    var dirx = ((sidex==1)? 1: -1);
    this.speedy = diry*getRandomInt(1,10);
    this.speedx = dirx*getRandomInt(1,10);
    this.dropInterval =getRandomInt(5,20);
    this.donations = getRandomInt(5,50);
    this.count = 0;
    this.id = id;
    this.topx = alumiSize;
    this.topy = alumiSize;
    this.color = "gray";
    this.imgSrc = "alumniGame.png"
    this.sprite = new Image();
    this.sprite.src =this.imgSrc;
    this.in = true
  }
  dropAndDash(){
    k = INBounds(this.x,this.y)
    var inbounds = k[0]&&k[1];
    if (inbounds){
      if(this.count%this.dropInterval==0&&this.count<100){
        console.log(amoneyLocations)
        for(i=0;i<50;i++){
          var k = amoneyLocations[i];
          var amt = [this.topx/2,this.topy/2]
          if(k[0]==-1){
            amoneyLocations[i] = [this.x,this.y,this.donations]
            break;
          }
        }
      }
      console.log(this.count,this.dropInterval,this.donations,this.count%this.dropInterval==0)
      this.x +=this.speedx;
      this.y +=this.speedy;
      this.count+=1;
   }
   else{
     this.x=-100;
     this.y= -100;
   }
  }
}
class player{
  constructor(speed,id,startx,starty) {
    this.speed = speed;
    this.id = id;
    this.x =startx;
    this.topx = playerSize;
    this.y =starty;
    this.topy = playerSize*2;
    this.color = "blue";
    this.tuition = 100
    this.dropAmt = 10;
    this.alive = true;
    this.imgSrc = "playerGame.png"
    this.sprite = new Image();
    this.sprite.src =this.imgSrc;
  }
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
      else{
        console.log("invalid Dir");
      }

  }
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
      else{
        console.log("invalid Dir");
      }

  }
  dropCash(){
    var i = 0;
    if( this.tuition >= this.dropAmt && this.dropAmt >0 ){
        for(i=0;i<20;i++){
          var k = pmoneyLocations[i];
          if(k[0]==-1){
            var placex = this.topx/2;
            var placey = this.topy/2;
            pmoneyLocations[i] = [this.x+placex,this.y+placey,this.dropAmt];
            break;
          }
        }
        this.tuition -=this.dropAmt;
    }
  }
  increaseDrop(){
    if(this.dropAmt<this.tuition){
      this.dropAmt+=5;
    }
  }
  decreaseDrop(){
    if(this.dropAmt>0){
      this.dropAmt-=5;
    }
  }

}
class pressBrown{
  constructor(speed,id,startx,starty) {
    this.speed = speed;
    this.id = id;
    this.x =startx;
    this.topx = prezSize;
    this.y =starty;
    this.topy = prezSize;
    this.color = "black";
    this.burgerFund = 0;

    this.imgSrc = "pbrown.gif"
    this.sprite = new Image();
    this.sprite.src =this.imgSrc;

    this.justPayed = false;
    this.alive = true;
  }
  gobbleGobble(players){
    var amt = [this.topx/2,this.topy/2]
    var min = [distance(this.x+amt[0],this.y+amt[1],players.x,players.y)/(players.tuition/2),players.x,players.y]
    for(i=0;i<20;i++){
      var k = pmoneyLocations[i];

      var dis = distance(this.x+amt[0],this.y+amt[1],k[0],k[1])
      if (checkIntersection(this.x,this.y,this.topx,this.topy,k[0],k[1],k[0]+k[2],k[1]+k[2])){
        pmoneyLocations[i] =[-1,-1,-1];
        var growth = Math.sqrt(k[2]);
        this.topx += growth;
        this.topy += growth;
        this.burgerFund += k[2];
      }
      else{
        dis = dis/k[2];
        if(min[0]>dis && k[0]!=-1){
          min = [dis,k[0],k[1]]
        }
      }

    }
    for(i=0;i<50;i++){
      var k = amoneyLocations[i];
      var dis = distance(this.x+amt[0],this.y+amt[1],k[0],k[1])
      if (dis<k[2]/2+(this.topx+this.topy)/4){
        amoneyLocations[i] =[-1,-1,-1];
        var growth = Math.sqrt(k[2]);
        this.topx += growth;
        this.topy += growth;
        this.burgerFund += k[2];
      }
      else{
        dis = dis/k[2];
        if(min[0]>dis && k[0]!=-1){
          min = [dis,k[0],k[1]]
        }
      }

    }

    if(min[0] != 1000 ){
      if (this.x-min[1]> 0){
        this.x= this.x-this.speed;
      }
      else{
        this.x= this.x+this.speed;
      }

      if (this.y-min[2]> 0){
        this.y= this.y-this.speed;
      }
      else{
        this.y= this.y+this.speed;
      }
    }
  }
  losingMoney(fuckUp){
     if(checkIntersection(this.x,this.y,this.topx,this.topy,fuckUp.x,fuckUp.y,fuckUp.topx,fuckUp.topy) ){
        this.justPayed = true;
        var cost = Math.sqrt(fuckUp.cost)
        this.topx -= cost/2;
        this.topy -= cost/2;
        this.burgerFund -= fuckUp.cost;
        if(this.burgerFund<0){
          this.alive = false;
          }
      }
     else {
       this.justPayed = false;
     }
  }
}
class PresFuckUps{
  constructor(size,x,y){
    this.x = x;
    this.y = y
    this.topx = size;
    this.topy = size;
    this.color = "aqua";
    this.cost = 5;
  }
}
const player1 = new player(10,0,canvDems[0]/2,canvDems[1]/2)
const pressBrown1 = new pressBrown(2,1,0,canvDems[1]/2)
const Alum1 = new Alumi(3);
const Covid = new PresFuckUps(getRandomInt(20,50),getRandomInt(0,canvDems[0]),getRandomInt(0,canvDems[1]))
function drawFuckUp(ctx){
  ctx.fillStyle = Covid.color;
  ctx.fillRect(Covid.x, Covid.y, Covid.topy, Covid.topx);
}
function drawplayer(ctx){
  // ctx.fillStyle = player1.color;
  // ctx.fillRect(player1.x, player1.y, player1.topy, player1.topx);
  ctx.drawImage(player1.sprite,player1.x, player1.y, player1.topy, player1.topx);
  var str = "Tuition: "+ player1.tuition.toString();
  var str1 = "Semester Payment: "+ player1.dropAmt.toString();
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText(str, 10, 20);
  ctx.fillText(str1, 10, 50);
}
function drawprez(ctx){
  // ctx.fillStyle = pressBrown1.color;
  // ctx.fillRect(pressBrown1.x, pressBrown1.y, pressBrown1.topy, pressBrown1.topx);
  ctx.drawImage(pressBrown1.sprite,pressBrown1.x, pressBrown1.y, pressBrown1.topy, pressBrown1.topx);
}
function drawAlum(ctx){
  // ctx.fillStyle = Alum1.color;
  // ctx.fillRect(Alum1.x, Alum1.y, Alum1.topy, Alum1.topx);
  ctx.drawImage(Alum1.sprite,Alum1.x, Alum1.y, Alum1.topy, Alum1.topx);
}
function drawCash(ctx){
  var cashScaleFactor = 5
  var i = 0;
  ctx.fillStyle = "green";
  var CashInPlay = false;
  for(i=0;i<20;i++){
    var k = pmoneyLocations[i];
    if (k[0]!=-1){
      CashInPlay=true;
      var amt = (k[2]/2)*cashScaleFactor
      // ctx.fillRect(k[0]-amt, k[1]-amt, k[2], k[2]);
      ctx.drawImage(cashimg,k[0]-amt, k[1]-amt, k[2]*cashScaleFactor, k[2]*cashScaleFactor);
    }
  }

  for(i=0;i<50;i++){
    var k = amoneyLocations[i];
    if (k[0]!=-1){
      var amt = (k[2]/2);
      // ctx.fillRect(k[0]-amt, k[1]-amt, k[2], k[2]);
      ctx.drawImage(cashimg,k[0]-amt, k[1]-amt, k[2], k[2]);
    }
  }
  if(!CashInPlay&&player1.tuition<5){
    player1.alive=false;
  }
}
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
var gameOver = [false,0];
function update(){
  ctx = canvas.getContext('2d');
  if(!gameOver[0]){
    // ctx.fillStyle = "red";
    // ctx.fillRect(0, 0, canvDems[0],canvDems[1]);
    ctx.drawImage(background,0, 0, canvDems[0],canvDems[1]);
    drawCash(ctx);
    drawprez(ctx);
    drawAlum(ctx);
    drawplayer(ctx);
    drawFuckUp(ctx);
    Alum1.dropAndDash();
    pressBrown1.gobbleGobble(player1);
    pressBrown1.losingMoney(Covid);
    console.log(pressBrown1.burgerFund)
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
document.onkeydown = function (event) {
      console.log(event.keyCode)
      switch (event.keyCode) {
         case 13:

            break;
         case 32:
            player1.dropCash();
            break;
         case 37:
            // console.log("Left key is pressed.");
            player1.moveHorz(-1);
            break;
         case 38:
            // console.log("Up key is pressed.");
            player1.moveVert(-1);
            break;
         case 39:
            // console.log("Right key is pressed.");
            player1.moveHorz(1);
            break;
         case 40:
            // console.log("Down key is pressed.");
            player1.moveVert(1);
            break;
         case 82:
            window.location.reload(true);
            break;
         case 90:
               // console.log("Down key is pressed.");
               player1.decreaseDrop();
               break;
         case 88:
               // console.log("Down key is pressed.");
               player1.increaseDrop();
               break;
      }

};
const run = setInterval(function() {
   update();
 }, 30);
