// ----------------------------------------- Ball
var Ball = function(_angle, _col){
    this.speed = ballSpeed;
    this.pos = createVector(windowWidth/2, windowHeight/2);
    this.vel = createVector(-this.speed, 0);
    this.col = _col;
    this.angle = _angle;
    this.vel.rotate(this.angle);
    this.angleRange = 65;
    this.score1 = 0;
    this.score2 = 0;
    this.hit = 0;
};
Ball.prototype.update = function(deltaTime){
    var x = this.vel.x * deltaTime * 0.05;
    var y = this.vel.y * deltaTime * 0.05;
    this.pos.add([x, y]);
    if(this.pos.y<0){ // wall hit
        this.vel.y *= -1;
        this.pos.y = 0;
        sBallTable.play();
    }
    if(this.pos.y>windowHeight){ // wall hit
        this.vel.y *= -1;
        this.pos.y = windowHeight;
        sBallTable.play();
    }
    if(this.pos.x<0){ // player Right loose
        pRScore++;
        dekartComNum = int(random(0, dekartCom.length-1));
        this.resetLeft();
        loose = true;
        sPLoose.play();
    }else{
        loose = false;
    }
    if(this.pos.x>windowWidth){  // player Left loose
        pLScore++;
        kantComNum = int(random(0, kantCom.length-1));
        this.resetRight();
        win = true;
        sPWin.play();
    }else{
        win = false;
    }
    if(this.intersectL()){
        this.hit = 0;
        this.intersect = this.pos.y - pLposY;
        this.pos.x = pLposX;
        this.vel.set(this.speed,0);
        this.angle = map(this.intersect,0,rectsize,-this.angleRange,this.angleRange);
        this.anglerad = radians(this.angle);
        this.vel.rotate(this.anglerad);
        this.pos.add(this.vel);
        sBallHit.play();
        allScore += int(1*level);
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
        sBallHit.play();
    }
};
Ball.prototype.draw = function(){
    noStroke();
    fill(this.col);
    ellipse(this.pos.x,this.pos.y, 12, 12);
};
Ball.prototype.resetRight = function(){
    this.pos.set(pLposX,pLposY+rectsize/2);
    this.vel = createVector(this.speed, 0);
    this.vel.rotate(random(-1,1));
};
Ball.prototype.resetLeft = function(){
    this.pos.set(pRposX,pRposY+rectsize/2);
    this.vel = createVector(-this.speed, 0);
    this.vel.rotate(random(-1,1));
};
Ball.prototype.reset = function(){
    this.hit = 0;
    this.pos.set(windowWidth/2,windowHeight/2);
    this.vel = createVector(-this.speed, 0);
};
Ball.prototype.intersectL = function(){
    if(this.pos.y>pLposY && this.pos.y< pLposY+rectsize && this.pos.x<pLposX && this.pos.x>10){
        return true;
    }else{
        return false;
    }
};
Ball.prototype.intersectR = function(){
    if(this.pos.y>pRposY && this.pos.y< pRposY+rectsize && this.pos.x>pRposX && this.pos.x<windowWidth-10){
        return true;
    }else{
        return false;
    }
};