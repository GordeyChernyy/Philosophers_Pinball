// ----------------------------------------- Ball
var Ball = function(image){ 
    this.sprite = createSprite(width/2, height/2, 10, 10);
    this.sprite.addImage(image);
    this.maxSpeed = 10;
    this.sprite.maxSpeed = 10;
    this.sprite.setSpeed(10, -180);
    // delegate
    this.onLooseFunc = [];
    this.onWinFunc = [];
    this.onLeftCollideFunc = [];
    this.onRightCollideFunc = [];
    this.onWallCollideFunc = [];
    // colliders
    this.paddleLeft = createSprite();
    this.paddleRight = createSprite();
    this.wallTop = createSprite();
    this.wallBottom = createSprite();
};
Ball.prototype.onLoose = function(func){ // subscribe to loose event
    this.onLooseFunc.push(func);
};
Ball.prototype.onWin = function(func){ // subscribe to win event
    this.onWinFunc.push(func);
};
Ball.prototype.onLeftCollide = function(func){ 
    this.onLeftCollideFunc.push(func);
};
Ball.prototype.onRightCollide = function(func){
    this.onRightCollideFunc.push(func);
};
Ball.prototype.onWallCollide = function(func){
    this.onWallCollideFunc.push(func);
};
Ball.prototype.pos = function(){ // get ball position
    return this.sprite.position;
};
Ball.prototype.update = function() {
    if(this.sprite.bounce(this.wallTop)){
        for (var i = 0; i < this.onWallCollideFunc.length; i++) { // run every subscribed function in array
            this.onWallCollideFunc[i]();
        }
    }
    if(this.sprite.bounce(this.wallBottom)){
        for (var i = 0; i < this.onWallCollideFunc.length; i++) { // run every subscribed function in array
            this.onWallCollideFunc[i]();
        }
    }

    if(this.sprite.bounce(this.paddleLeft)){ // paddle left collide
        for (var i = 0; i < this.onLeftCollideFunc.length; i++) { // run every subscribed function in array
            this.onLeftCollideFunc[i]();
        }
        var swing = (this.sprite.position.y-this.paddleLeft.position.y)/3;
        this.sprite.setSpeed(this.maxSpeed, this.sprite.getDirection()+swing);
    }
    if(this.sprite.bounce(this.paddleRight)){ // paddle right collide
        for (var i = 0; i < this.onRightCollideFunc.length; i++) { // run every subscribed function in array
            this.onRightCollideFunc[i]();
        }
        var swing = (this.sprite.position.y-this.paddleRight.position.y)/3;
        this.sprite.setSpeed(this.maxSpeed, this.sprite.getDirection()+swing);
    }
    if(this.sprite.position.x<0) { // reset ball and move it the right
        for (var i = 0; i < this.onLooseFunc.length; i++) { // run every subscribed function in array
            this.onLooseFunc[i]();
        }
        this.sprite.position.x = width/2;
        this.sprite.position.y = height/2;
        this.sprite.setSpeed(this.maxSpeed, 0);
    }

    if(this.sprite.position.x>width) { // reset ball and move it the left
        for (var i = 0; i < this.onWinFunc.length; i++) { // run every subscribed function in array
            this.onWinFunc[i]();
        }
        this.sprite.position.x = width/2;
        this.sprite.position.y = height/2;
        this.sprite.setSpeed(this.maxSpeed, 180);
    }
};