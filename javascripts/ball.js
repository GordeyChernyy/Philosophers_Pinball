// ----------------------------------------- Ball
var Ball = function(image) {
    this.sprite = createSprite(width / 2, height / 2, 10, 10);
    this.sprite.addImage(image);
    this.sprite.depth = 5000;
    // speed
    this.maxSpeed = 5;
    this.initSpeed = 5;
    this.handSpeed = 5;
    this.sprite.maxSpeed = 20;
    this.sprite.setSpeed(10, -90);
    this.collideCounter = 0; // create protection to not stuck inside the quote blocks
    this.sprite.delay = 0; // protection from multiple ball hit he can't hit for severel time during some mseconds 
    // delegate emulation
    this.onLooseFunc = [];
    this.onWinFunc = [];
    this.onLeftCollideFunc = [];
    this.onRightCollideFunc = [];
    this.onWallCollideFunc = [];
    // colliders
    this.paddleLeft;
    this.paddleRight;
    this.wallTop;
    this.wallBottom;
    this.collideWithOthers = false; // protection from obstacle stucking in case ball reset
};
Ball.prototype.onLoose = function(func) { // subscribe to loose event
    this.onLooseFunc.push(func);
};
Ball.prototype.onWin = function(func) { // subscribe to win event
    this.onWinFunc.push(func);
};
Ball.prototype.onLeftCollide = function(func) {
    this.onLeftCollideFunc.push(func);
};
Ball.prototype.onRightCollide = function(func) {
    this.onRightCollideFunc.push(func);
};
Ball.prototype.onWallCollide = function(func) {
    this.onWallCollideFunc.push(func);
};
Ball.prototype.pos = function() { // get ball position
    return this.sprite.position;
};
Ball.prototype.bounceWith = function(sprites) {
    if(this.collideWithOthers){        
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (this.sprite.bounce(sprite)) {
                for (var i = 0; i < this.onWallCollideFunc.length; i++) { // run every subscribed function in array
                    this.onWallCollideFunc[i]();
                }
                this.collideCounter++;
                // how many times it should collide in case of stucking
                if(this.collideCounter > 5){
                    this.collideWithOthers = false;
                }
            }
        }
    }
}
Ball.prototype.update = function() {
    this.wallCollide();
    this.paddleA();
    this.paddleB();
    this.lose();
    this.win();
};
Ball.prototype.wallCollide = function() {
    if (this.sprite.bounce(this.wallTop)) {
        for (var i = 0; i < this.onWallCollideFunc.length; i++) { // run every subscribed function in array
            this.onWallCollideFunc[i]();
        }
        this.collideCounter=0;
    }
    if (this.sprite.bounce(this.wallBottom)) {
        for (var i = 0; i < this.onWallCollideFunc.length; i++) { // run every subscribed function in array
            this.onWallCollideFunc[i]();
        }
        this.collideCounter=0;
    }
}
Ball.prototype.paddleA = function() {
    // to avoid multiple colliding 
    var available = this.sprite.delay < 0 ? true : false;
    // paddle left collide
    if (this.sprite.bounce(this.paddleLeft) && available) {
        // after player hits the ball it can collide with obsctacles
        this.collideWithOthers = true;
        // set delay to protect ball from multiple hits in msecond interval
        this.sprite.delay = 4;
        // set speed from other source
        this.maxSpeed = this.handSpeed;
        // delegate
        for (var i = 0; i < this.onLeftCollideFunc.length; i++) { // run every subscribed function in array
            this.onLeftCollideFunc[i]();
        }
        // ball custom reflection
        var swing = (this.sprite.position.x - this.paddleLeft.position.x) / 1.8;
        this.sprite.setSpeed(this.maxSpeed, this.sprite.getDirection() + swing);
        // reset collideCounter
        this.collideCounter=0;
    }
    this.sprite.delay--;
}
Ball.prototype.paddleB = function() {
    // paddle right collide
    if (this.sprite.bounce(this.paddleRight)) {
        // after player hits the ball it can collide with obsctacles
        this.collideWithOthers = true;
        // delegate
        for (var i = 0; i < this.onRightCollideFunc.length; i++) { // run every subscribed function in array
            this.onRightCollideFunc[i]();
        }
        // ball custom reflection
        var swing = (this.sprite.position.x - this.paddleRight.position.x) / 1.8;
        this.sprite.setSpeed(this.maxSpeed, this.sprite.getDirection() + swing);
        // reset collideCounter
        this.collideCounter=0;
    }
}
Ball.prototype.lose = function() {
    // reset ball and move it the right
    if (this.sprite.position.y > height) {
       // Don't collide with obsctacles
        this.collideWithOthers = false;

        for (var i = 0; i < this.onLooseFunc.length; i++) { // run every subscribed function in array
            this.onLooseFunc[i]();
        }
        this.sprite.position.x = width / 2;
        this.sprite.position.y = height / 2;
        this.sprite.setSpeed(this.initSpeed, -90);
    }
}
Ball.prototype.win = function() {
    if (this.sprite.position.y < 0) {
        // Don't collide with obsctacles
        this.collideWithOthers = false;

        for (var i = 0; i < this.onWinFunc.length; i++) { // run every subscribed function in array
            this.onWinFunc[i]();
        }
        this.sprite.position.x = width / 2;
        this.sprite.position.y = height / 2;
        this.sprite.setSpeed(this.initSpeed, 90);
    }
};