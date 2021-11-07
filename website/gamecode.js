var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth*0.95;
canvas.height = window.innerHeight*0.85;
var canvDems = [canvas.width, canvas.height];
var playerSize = 50;
var alumiSize = 30;
var prezSize = 20;


var pmoneyLocations = [...Array(20)].map(e => Array(3));
var amoneyLocations = [...Array(50)].map(e => Array(3));
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
class Alumi {
  constructor(id) {
    var sidex= getRandomInt(1,2);
    var sidey= getRandomInt(1,2);
    this.y =((sidey==1)? 0: canvDems[1]);
    this.x =((sidex==1)? 0: canvDems[0]);
    var diry = ((sidey==1)? 1: -1);
    var dirx = ((sidex==1)? 1: -1);
    this.speedy = diry*getRandomInt(1,20);
    this.speedx = dirx*getRandomInt(1,20);
    this.dropInterval =getRandomInt(5,20);
    this.donations = getRandomInt(5,50);
    this.count = 0;
    this.id = id;
    this.topx = alumiSize;
    this.topy = alumiSize;
    this.color = "gray";
  }
  dropAndDash(){
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
}
class player{
  constructor(speed,id,startx,starty) {
    this.speed = speed;
    this.id = id;
    this.x =startx;
    this.topx = playerSize;
    this.y =starty;
    this.topy = playerSize;
    this.color = "blue";
    this.tuition = 100
    this.dropAmt = 10;
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
  dropCash(amt){
    var i = 0;
    if( this.tuition >= amt && amt >0 ){
        for(i=0;i<20;i++){
          var k = pmoneyLocations[i];
          if(k[0]==-1){
            var placex = this.topx/2;
            var placey = this.topy/2;
            pmoneyLocations[i] = [this.x+placex,this.y+placey,amt];
            break;
          }
        }
        this.tuition -=amt;
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
  }
  gobbleGobble(){
    var min = [1000,-1,-1]
    for(i=0;i<20;i++){
      var k = pmoneyLocations[i];
      var amt = [this.topx/2,this.topy/2]
      var dis = distance(this.x+amt[0],this.y+amt[1],k[0],k[1])
      if (dis<k[2]+(this.topx+this.topy)/2){
        pmoneyLocations[i] =[-1,-1,-1];
        this.topx += k[2];
        this.topy += k[2];
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
      var amt = [this.topx/2,this.topy/2]
      var dis = distance(this.x+amt[0],this.y+amt[1],k[0],k[1])
      if (dis<k[2]+(this.topx+this.topy)/2){
        amoneyLocations[i] =[-1,-1,-1];
        this.topx += k[2];
        this.topy += k[2];
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
}
const player1 = new player(10,0,canvDems[0]/2,canvDems[1]/2)
const pressBrown1 = new pressBrown(2,1,canvDems[0]/2,canvDems[1]/2)
const Alum1 = new Alumi(3);

function drawplayer(ctx){
  ctx.fillStyle = player1.color;
  ctx.fillRect(player1.x, player1.y, player1.topy, player1.topx);

  var str = "Tuition: "+ player1.tuition.toString();
  var str1 = "Semester Payment: "+ player1.dropAmt.toString();
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText(str, 10, 20);
  ctx.fillText(str1, 10, 50);
}
function drawprez(ctx){
  ctx.fillStyle = pressBrown1.color;
  ctx.fillRect(pressBrown1.x, pressBrown1.y, pressBrown1.topy, pressBrown1.topx);
}
function drawAlum(ctx){
  ctx.fillStyle = Alum1.color;
  ctx.fillRect(Alum1.x, Alum1.y, Alum1.topy, Alum1.topx);
}
function drawCash(ctx){
  var i = 0;
  ctx.fillStyle = "green";
  for(i=0;i<20;i++){
    var k = pmoneyLocations[i];
    if (k[0]!=-1){
      var amt = k[2]/2
      ctx.fillRect(k[0]-amt, k[1]-amt, k[2], k[2]);
    }
  }
  for(i=0;i<50;i++){
    var k = amoneyLocations[i];
    if (k[0]!=-1){
      var amt = k[2]/2
      ctx.fillRect(k[0]-amt, k[1]-amt, k[2], k[2]);
    }
  }
}

function update(){
  ctx = canvas.getContext('2d');
  ctx.fillStyle = "red";
  ctx.fillRect(0, 0, canvDems[0],canvDems[1]);
  drawCash(ctx);
  drawprez(ctx);
  drawAlum(ctx);
  drawplayer(ctx);
  Alum1.dropAndDash()
  pressBrown1.gobbleGobble();



}
document.onkeydown = function (event) {
      console.log(event.keyCode)
      switch (event.keyCode) {
         case 32:
            player1.dropCash(player1.dropAmt);
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
         case 90:
               // console.log("Down key is pressed.");
               player1.decreaseDrop();
               break;
         case 88:
               // console.log("Down key is pressed.");
               player1.increaseDrop();
               break;
      }
      update();
};
function rungame(){
    console.log("running");
    update();
    // while(true){
    //   update();
    // }
}
// moneyLocations[0] = [200,200];
rungame()
