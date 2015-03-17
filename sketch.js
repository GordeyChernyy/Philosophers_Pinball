var w = 1000;
var h = 600;
var levelMin = 0.02;
var levelMax = 0.2; // optimal 0.02 0.2
var level = 0;
var levelScore = 5;

var ball, ball2;
var ballSpeed = 10;
var dualism;
var pLeyeL, pLeyeR, pReyeL, pReyeR;
var showBall2 = false;
var ball2Col;

var showDualism = false;
var dualismLifetime = 500;
var dualismLife = 0;
var dualismInt = 100;
var dualismIntMin = 200;
var dualismIntMax = 500;
var border = 120;

var rectsize = 100;
var pLposX = border;
var pLposY = 0;
var pRposX = w-border;
var pRposY = 0;
var m = "test";
var x = 0;

var pLScore = 0, pRScore = 0;
var win = false;
var loose = false;
var faceTime = 0;
var faceChange = false;
var pause = false;

var kantCom;
var kantComNum = 0;
var dekartCom;
var dekartComNum = 0;
var kant, kantPlain,  kantSad, kantHappy,
dekart;
// ----------------------------------------- Preload
function preload() {
    kantPlain = loadImage("images/kant.png");
    kantSad = loadImage("images/kant_sad.png");
    kantHappy = loadImage("images/kant_happy.png");
    dekart = loadImage("images/dekart.png");
    kantCom = loadStrings('kant.txt');
    dekartCom = loadStrings('dekart.txt');
}
// ----------------------------------------- Setup
function setup() {
    canvas = createCanvas(w, h);
    canvas.position((windowWidth-w)/2, 50);
    ball2Col = color(0, 255, 0);
    var ballCol = color(255, 255, 255);
    ball = new Ball(0, ballCol);
    ball2 = new Ball(0, ball2Col);
    pLeyeL = new Eye();
    pLeyeR = new Eye();
    pReyeL = new Eye();
    pReyeR = new Eye();
    dualism = new Power();

}
function windowResized(){
    canvas.position((windowWidth-w)/2, 50);
}
// ----------------------------------------- Draw
function draw() {
    background(0);
    if(!pause){
        levelChek();
        ball.update();
        ball.draw();
        pLeft();
        pRight();
        dualball();
        score();
        commentDraw();
    }else{
        pauseGame();
    }
  //    message();
}
// ----------------------------------------- Mouse
function mouseMoved(){
    pLposY = mouseY-rectsize/2;
}
function mouseClicked(){
    if(pause){
        nextLevel();
    }
}
// ----------------------------------------- Function
function commentDraw(){
    textSize(12);
    fill(255);
    var t = kantCom[kantComNum];
    var t2 = dekartCom[dekartComNum];
    push();
    translate(pLposX-100, pLposY+120);
    text(t,0,0, 200, 100);
    pop();
    push();
    translate(pRposX-100, pRposY+120);
   text(t2,0,0, 200, 100);
    pop();
}
function message(){
    noStroke();
    textSize(22);
    fill(255);
    m =
        "dualismLife ="+dualismLife+"\n"+
        "dualismLifetime = "+dualismLifetime;
    text(m,20,20);
}
function pLeft(){
    var p = ball.pos;
    if(ball2.pos.x < ball.pos.x){
        p = ball2.pos;
    }
    pLeyeL.x = 52;
    pLeyeL.y = pLposY;
    pLeyeL.update(p.x,p.y);
    pLeyeL.display();
    
    pLeyeR.x = 79;
    pLeyeR.y = pLposY;
    pLeyeR.update(p.x,p.y);
    pLeyeR.display();
    
    push();
    translate(pLposX,pLposY);
    pLface();
    stroke(255);
//    line(0,0,0,rectsize);
    pop();
}
function pLface(){
    if(win || loose) faceChange = true;
    if(faceChange){
        faceTime++;
        if(win)kant = kantHappy;
        if(loose)kant = kantSad;
    }else{
        kant = kantPlain;
    }
    if(faceTime>100){
        faceChange = false;
        faceTime = 0;
    }
    push();
    translate(-139, -54);
    image(kant, 0 , 0);
    pop();
}
function pRight(){
    var p = ball.pos;
    
    if(ball2.pos.x > ball.pos.x){
        p = ball2.pos;
    }
    if(p.x>w/2){
        pRposY = pRposY+(p.y-pRposY-rectsize/2)*random(levelMin, levelMax);
    }else{
        var n = noise(frameCount/100.0)*h;
        pRposY = pRposY+(n-pRposY-rectsize/2)*0.01;
    }
    pReyeL.update(p.x,p.y);
    pReyeL.x = pRposX+43;
    pReyeL.y = int(2+pRposY);
    
    pReyeL.display();
    pReyeR.update(p.x,p.y);
    pReyeR.x = pRposX+73;
    pReyeR.y = int(2+pRposY);
    
    pReyeR.display();
    push();
    translate(pRposX,pRposY);
    pRface();
    stroke(255);
//    line(0,0,0, rectsize);
    pop();
    
}
function pRface(){
    push();
    translate(-2, -54);
    image(dekart, 0 , 0);
    pop();
}
function dualball(){
    if(frameCount%dualismInt == 0 && !showDualism && !showBall2){
        showDualism = true;
    }
    if(dualism.isDead()){
        dualism.reset();
        showDualism = false;
        dualismInt = int(random(dualismIntMin,dualismIntMax));
    }
    if(showDualism){
        dualism.update();
        dualism.draw();
    }
    if(dualism.intersect()){
        ball2.resetRight();
        showBall2 = true;
        showDualism = false;
        dualism.reset();
        dualismInt = int(random(dualismIntMin,dualismIntMax));
    }
    if(showBall2){
        ball2.update();
        ball2.draw();
        dualismLife++;
    }
    if(dualismLife > dualismLifetime){
        showBall2 = false;
        ball2.reset();
        dualismLife = 0;
        
    }
}
function score(){
    textSize(15);
    var info = "Level: "+level+"  |  Kant: "+pLScore+"  |  Descartes: "+pRScore;
    var tw = textWidth(info);
    if(showBall2){
        var t = "Dualism:";
        text(t,30,30);
        var rw = map(dualismLife,0,dualismLifetime,100,0);
        rect(30,40,rw,5);
    }
    noStroke();
    fill(255);
    text(info,w/2-tw/2,30);
}
function pauseGame(){
    textSize(20);
    var _t = "Level: "+level;
    var _tw = textWidth(_t);
    fill(0, 255, 0);
    text(_t,w/2-_tw/2,h/2-200);
    
    textSize(40);
    noStroke();
    if(pLScore==levelScore){
        var t = "Congratulations, Kant Win!";
        var tw = textWidth(t);
        fill(0, 255, 0);
        text(t,w/2-tw/2,h/2+cos(frameCount/20.0)*20);
    }
    if(pRScore==levelScore){
        var t = "You loose, Descartes Win!";
        var tw = textWidth(t);
        fill(255, 0, 0);
        text(t,w/2-tw/2,h/2+cos(frameCount/20.0)*20);
    }
    textSize(20);
    var t = "Click to enter for the next level";
    var tw = textWidth(t);
    fill(0, 255, 0);
    text(t,w/2-tw/2,h/2+100);
}
function levelChek(){
    if(pLScore==levelScore || pRScore == levelScore){
        pause = true;
    }
}
function nextLevel(){
    ball.reset();
    ball2.reset();
    pause = false;
    levelMax += 0.05;
    level++;
    pLScore = 0;
    pRScore = 0;
}
// ----------------------------------------- Ball
var Ball = function(_angle, _col){
    this.speed = ballSpeed;
    this.pos = createVector(w/2, h/2);
    this.vel = createVector(-this.speed, 0);
    this.col = _col;
    this.angle = _angle;
    this.vel.rotate(this.angle);
    this.angleRange = 65;
    this.score1;
    this.score2;
    this.hit = 0;
}
Ball.prototype.update = function(){
    this.pos.add(this.vel);
    if(this.pos.y<0){
        this.vel.y *= -1;
        this.pos.y = 0;
    }
    if(this.pos.y>h){
        this.vel.y *= -1;
        this.pos.y = h;
    }
    if(this.pos.x<0){
        pRScore++;
        dekartComNum = int(random(0, dekartCom.length-1));
        this.resetLeft();
        loose = true;
    }else{loose = false;}
    if(this.pos.x>w){
        pLScore++;
        kantComNum = int(random(0, kantCom.length-1));
        this.resetRight();
        win = true;
    }else{win = false;}
    
    if(this.intersectL()){
        this.hit = 0;
        this.intersect = this.pos.y - pLposY;
        this.pos.x = pLposX;
        this.vel.set(this.speed,0);
        this.angle = map(this.intersect,0,rectsize,-this.angleRange,this.angleRange);
        this.anglerad = radians(this.angle);
        this.vel.rotate(this.anglerad);
        this.pos.add(this.vel);
    }
    if(this.intersectR()){
        this.hit = 0;
        var intersect = this.pos.y - pRposY;
        this.pos.x = pRposX;
        this.vel.set(-this.speed,0);
        this.angle = map(intersect,0,rectsize,this.angleRange,-this.angleRange);
        this.anglerad = radians(this.angle);
        this.vel.rotate(this.anglerad);
        this.pos.add(this.vel);
    }
}
Ball.prototype.draw = function(){
    noStroke();
    fill(this.col);
    ellipse(this.pos.x,this.pos.y, 12, 12);
}
Ball.prototype.resetRight = function(){
    this.pos.set(pLposX,pLposY+rectsize/2);
    this.vel = createVector(this.speed, 0);
    this.vel.rotate(random(-1,1));
}
Ball.prototype.resetLeft = function(){
    this.pos.set(pRposX,pRposY+rectsize/2);
    this.vel = createVector(-this.speed, 0);
    this.vel.rotate(random(-1,1));
}
Ball.prototype.reset = function(){
    this.hit = 0;
    this.pos.set(w/2,h/2);
    this.vel = createVector(-this.speed, 0);
}
Ball.prototype.intersectL = function(){
    if(this.pos.y>pLposY && this.pos.y< pLposY+rectsize && this.pos.x<pLposX && this.pos.x>10){
        return true;
    }else{
        return false;
    }
}
Ball.prototype.intersectR = function(){
    if(this.pos.y>pRposY && this.pos.y< pRposY+rectsize && this.pos.x>pRposX && this.pos.x<w-10){
        return true;
    }else{
        return false;
    }
}
// ----------------------------------------- Power
var Power = function() {
    this.speed = ballSpeed;
    this.pos = createVector(w, random(10, h));
    this.vel = createVector(-this.speed, 0);
}
Power.prototype.update = function(){
    this.pos.add(this.vel);
}
Power.prototype.reset = function(){
    this.pos.set(w,random(10, h-10));
}
Power.prototype.draw = function(){
    noStroke();
    fill(ball2Col);
    textSize(20);
    text("dualizm",this.pos.x,this.pos.y);
}
Power.prototype.isDead = function(){
    if(this.pos.x<0){
        return true;
    }else{
        return false;
    }
}
Power.prototype.intersect = function(){
    if(this.pos.y>pLposY && this.pos.y< pLposY+rectsize && this.pos.x<pLposX && this.pos.x>10){
        return true;
    }else{
        return false;
    }
}
// ----------------------------------------- Eye
var Eye = function() {
    this.x = 0;
    this.y = 0;
    this.size = 13;
    this.angle = 0.0;
}
Eye.prototype.update = function(my, mx){
    this.angle = atan2(my-this.y, mx-this.x);
}
Eye.prototype.display = function(){
    push();
    translate(this.x, this.y);
    noStroke();
    fill(213, 219, 176);
    ellipse(0, 0, this.size, this.size);
    rotate(this.angle);
    fill(0);
    var _x = 1.5;
    var pos = _x*2;
    ellipse(this.size/pos, 0, this.size/_x, this.size/_x);
    pop();
    push();
    translate(this.x, this.y);
    var _x2 = 3.0;
    var pos2 = _x2*2;
    fill(255, 100);
    ellipse(this.size/pos2, 0, this.size/_x2, this.size/_x2);
    pop();
}
