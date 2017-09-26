var windowWidth = 1000;
var windowHeight = 600;
var levelMin = 0.02;
var levelMax = 0.05; // optimal 0.02 0.2
var level = 1;
var levelScore = 3;
var allScore = 0;
var canvas;

var ball, ball2;
var ballSpeed = 10;
var dualism;
var pLeyeL, pLeyeR, pReyeL, pReyeR;
var showBall2 = false;
var ball2Col;

var imgDualism;
var colDualism;
var ballDelay = 60;
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
var pRposX = windowWidth-border;
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
var names;
var comment;
var kantComNum = 0;
var dekartCom;
var dekartComNum = 0;
var kant, kantPlain,  kantSad, kantHappy,
dekart;

var button;
var fbshare;
var twitter;
var myDiv;

var sMusic;
var sBallHit;
var sBallTable;
var sLoose;
var sWin;
var sDual;
var sPLoose;
var sPWin;
var playOnce;

var stars = [];
var starsCount = 40;

var deltaTime = 0.0;

// ----------------------------------------- Preload
function preload() {
    fbshare = createElement('div', '<div class="fb-share-button" data-href="http://gordeychernyy.github.io/Philosophers_Pinball/" data-layout="button_count"></div>');
    sMusic = loadSound('../Assets/sounds/music.mp3');
    sBallTable = loadSound('../Assets/sounds/ballTable.mp3');
    sBallHit = loadSound('../Assets/sounds/ballHit.mp3');
    sLoose = loadSound('../Assets/sounds/loose.mp3');
    sPLoose = loadSound('../Assets/sounds/pLoose.mp3');
    sPWin = loadSound('../Assets/sounds/pWin.mp3');
    sDual = loadSound('../Assets/sounds/dual.mp3');
    sWin = loadSound('../Assets/sounds/win.mp3');
    kantPlain = loadImage('../Assets/images/kant.png');
    kantSad = loadImage('../Assets/images/kant_sad.png');
    kantHappy = loadImage('../Assets/images/kant_happy.png');
    dekart = loadImage('../Assets/images/dekart.png');
    kantCom = loadStrings('../Assets/text/kant.txt');
    dekartCom = loadStrings('../Assets/text/dekart.txt');
    names = loadStrings('../Assets/text/names.txt');
    imgDualism = loadImage('../Assets/images/dualizm.png');
}
// ----------------------------------------- Setup
function setup() {
    canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('myContainer');
    canvas.position(0, 0);
    fbshare.hide();
    colDualism = color(246, 206, 53);
    ball2Col = colDualism;
    var ballCol = color(255, 255, 255);
    ball = new Ball(0, ballCol);
    ball2 = new Ball(0, ball2Col);
    pLeyeL = new Eye();
    pLeyeR = new Eye();
    pReyeL = new Eye();
    pReyeR = new Eye();
    dualism = new Power();
    button = createButton('play');
    button.mousePressed(play);
    frameRate(60);
    playOnce = true;
    createStars();
    sMusic.play();
    sMusic.loop();
    sMusic.playMode('restart');

}
function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    createStars();
}
// ----------------------------------------- Draw
function draw() {
    deltaTime = window.performance.now() - canvas._pInst._lastFrameTime;
    background(0);
    if(!pause){
        drawStars();
        if(ballDelay===0){
            ball.update(deltaTime);
        }
        ball.draw();
        pLeft();
        pRight();
        dualball();
        score();
        levelCheck();
        if(ballDelay>0){
            ballDelay--;
            noStroke();
            fill(255);
            textSize(20);
            text(int(ballDelay/8), windowWidth/2, windowHeight/2-20);
        }
    }else{
        pauseGame();
    }
  //    message();
}
// ----------------------------------------- Mouse
function touchMoved(){
    pLposY = mouseY-rectsize/2;
}
function mouseClicked(){
    
}
// ----------------------------------------- Function
function play(){
    if(pause){
        levelMax = 0.05;
        showDualism = false;
        showBall2 = false;
        ball2.reset();
        ball.reset();
        level = 1;
        pLScore = 0;
        pRScore = 0;
        allScore = 0;
        playOnce = true;
        button.position(-200, -200);
        ballDelay = 60;
        pause = false;
        fbshare.hide();
    }
}
function message(){
    noStroke();
    textSize(22);
    fill(colDualism);
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
    pRposX = windowWidth-border;
    var p = ball.pos;
    
    if(ball2.pos.x > ball.pos.x){
        p = ball2.pos;
    }
    if(p.x>windowWidth/2){
        pRposY = pRposY+(p.y-pRposY-rectsize/2)*random(levelMin, levelMax);
    }else{
        var n = noise(frameCount/100.0)*windowHeight;
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
    if(frameCount%dualismInt === 0 && !showDualism && !showBall2){
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
        sDual.play();
    }
    if(showBall2){
        ball2.update(deltaTime);
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
    var info = names[0]+" "+level+"  |  "+names[1]+" "+pLScore+"  |  "+names[2]+" "+pRScore+"\n"+
               "score: "+allScore;
    if(showBall2){
        var t = names[3];
        text(t,30,30);
        var rw = map(dualismLife,0,dualismLifetime,100,0);
        rect(30,40,rw,5);
    }
    noStroke();
    fill(255);
    textAlign(CENTER);
    text(info,windowWidth/2,30);
}
function pauseGame(){
    noStroke();
    textSize(30);
    textAlign(CENTER);
    fill(colDualism);
    var txScore = 'your score is: '+allScore;
    var txScoreW = textWidth(txScore);
    text(txScore, windowWidth/2, 50);
    if(level==6){
        textSize(20);
        textAlign(CENTER);
        fill(0, 255, 0);
        text(names[4], windowWidth/2, 120+cos(frameCount/20.0)*20);
        textAlign(LEFT);
        pLcomment();
        if(playOnce){
            sWin.play();
            playOnce = false;
        }
    }
    if(pRScore==levelScore){
        var t = names[5];
        textAlign(CENTER);
        textSize(20);
        fill(255, 0, 0);
        text(t,windowWidth/2,100+cos(frameCount/20.0)*20);
        textAlign(LEFT);
        pRcomment();
        if(playOnce){
            sLoose.play();
            playOnce = false;
        }
    }
    textSize(12);
    var tw = textWidth('Play again');
    button.position(windowWidth/2-tw/2, windowHeight-100);
    fbshare.position(windowWidth/2+txScoreW/2+20, 30);
    fbshare.show();
}
function pLcomment(){
    textSize(12);
    fill(255);
    var width = 300;
    var t = "<< \n\n"   +kantCom[kantComNum]+"\n\n>>     "+names[1];
    var tw = width;
    var th = textWidth(t)/width*12;
    text(t,windowWidth/2-tw/2, windowHeight/2-th, width, windowHeight);
}
function pRcomment(){
    textSize(12);
    fill(255);
    var width = 300;
    var t = "<< \n\n"   +dekartCom[dekartComNum]+"\n\n>>     "+names[2];
    var tw = width;
    var th = textWidth(t)/width*12;
    text(t,windowWidth/2-tw/2, windowHeight/2-th, width, windowHeight);
}
function levelCheck(){
    if(pRScore == levelScore || level == 6){
        pause = true;
    }
    if(pLScore%levelScore===0){
        nextLevel();
    }
}
function nextLevel(){
    if(pLScore==levelScore){
        levelMax += 0.05;
        level++;
    }
    pLScore = 0;
}
function createStars(){
    for(var i = 0; i < starsCount; i++ ){
        stars[i] = new Star();
    }
}
function drawStars(){
    for(var i = 0; i < starsCount; i++ ){
        stars[i].draw();
    }
}
// ----------------------------------------- Star
var Star = function(){
    this.speed = random(0.05, 0.12);
    this.pos = createVector(random(windowWidth), random(windowHeight));
    this.size = random(2, 6);
    this.opacity = random(20, 255);
};
Star.prototype.draw = function(){
    noStroke();
    fill(255, this.opacity);
    var s = this.size*(cos(frameCount*this.speed)*0.5+0.7);
    ellipse(this.pos.x, this.pos.y, s,s);
};

// ----------------------------------------- Power
var Power = function() {
    this.speed = ballSpeed;
    this.pos = createVector(windowWidth, random(10, windowHeight));
    this.vel = createVector(-this.speed, 0);
};
Power.prototype.update = function(){
    this.pos.add(this.vel);
};
Power.prototype.reset = function(){
    this.pos.set(windowWidth,random(10, windowHeight-10));
    this.vel = createVector(-this.speed, 0);
};
Power.prototype.draw = function(){
    image(imgDualism,this.pos.x,this.pos.y);
};
Power.prototype.isDead = function(){
    if(this.pos.x<0){
        return true;
    }else{
        return false;
    }
};
Power.prototype.intersect = function(){
    if(this.pos.y>pLposY && this.pos.y< pLposY+rectsize && this.pos.x<pLposX && this.pos.x>10){
        return true;
    }else{
        return false;
    }
};