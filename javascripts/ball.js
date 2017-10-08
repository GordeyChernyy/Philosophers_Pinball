// ----------------------------------------- Ball
var Ball = function(image) {
    this.enabled = false;
    this.sprite = createSprite(width / 2, height / 2, 10, 10);
    this.sprite.addImage(image);
    this.sprite.visible = false;
    this.sprite.setSpeed(0, 0);
    // speed
    this.maxSpeed = 5;
    this.initSpeed = 5;
    this.handSpeed = 5;
    this.sprite.maxSpeed = 20;
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

    var self = this;
    this.enable = function() {
        self.sprite.visible = true;
        self.enabled = true;
    }
    this.disable = function() {
        self.sprite.setSpeed(0, 0);
        self.sprite.position.set(width / 2, height / 2);
        self.sprite.visible = false;
        self.enabled = false;
        if (self.animator != undefined) delete self.animator;
    }

    this.onEvents = {
        loose: [],
        win: [],
        leftCollide: [],
        rightCollide: [],
        wordCollide: [],
        wallCollide: []
    };

    this.reset = function() {
        self.resetBall(-90);
    }

    this.runEvent = function(eventName) {
        for (var i = 0; i < self.onEvents[eventName].length; i++) {
            self.onEvents[eventName][i]();
        }
    }

    this.drawingStack = [];
};

Ball.prototype.subscribe = function(eventName, func) {
    this.onEvents[eventName].push(func);
};

Ball.prototype.onWallCollide = function(func) {
    this.onWallCollideFunc.push(func);
};

Ball.prototype.pos = function() { // get ball position
    return this.sprite.position;
};

Ball.prototype.bounceWith = function(sprites) {
    if (this.collideWithOthers && this.enabled) {
        for (var i = 0; i < sprites.length; i++) {
            var sprite = sprites[i];
            if (this.sprite.bounce(sprite)) {
                // not the good place to do it here but it is easy for now
                if (sprite.width < sprite.initWidth / 2) {
                    sprite.visible = false;
                    sprite.width = sprite.initWidth;
                    sprite.height = sprite.initHeigh;
                } else {
                    // var h 
                    var w = sprite.width / 2;
                    var h = sprite.height / 2;
                    var animator = new TWEEN.Tween(sprite)
                        .to({
                            width: w,
                            height: h
                        }, 600)
                        // .repeat(1)
                        // .yoyo(true)
                        .easing(TWEEN.Easing.Elastic.Out)
                        .start()

                    this.runEvent('wordCollide');
                    this.collideCounter++;
                    // how many times it should collide in case of stucking
                    if (this.collideCounter > 5) {
                        this.collideWithOthers = false;
                    }
                }
            }
        }
    }
}
Ball.prototype.update = function() {
    if (this.enabled) {
        this.wallCollide();
        this.paddleA();
        this.paddleB();
        this.lose();
        this.win();
    }
};
Ball.prototype.wallCollide = function() {
    if (this.sprite.bounce(this.wallTop)) {
        this.collideCounter = 0;
        this.runEvent('wallCollide');
    }
    if (this.sprite.bounce(this.wallBottom)) {
        this.collideCounter = 0;
        this.runEvent('wallCollide');
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
        this.sprite.delay = 7;
        // set speed from other source
        this.maxSpeed = this.handSpeed;
        // delegate
        // ball custom reflection
        var swing = (this.sprite.position.x - this.paddleLeft.position.x) / 1.8;
        this.sprite.setSpeed(this.maxSpeed, this.sprite.getDirection() + swing);
        // reset collideCounter
        this.collideCounter = 0;

        this.runEvent('leftCollide');
    }
    this.sprite.delay--;
}
Ball.prototype.paddleB = function() {
    // paddle right collide
    if (this.sprite.bounce(this.paddleRight)) {
        // after player hits the ball it can collide with obsctacles
        this.collideWithOthers = true;
        // delegate
        // ball custom reflection
        var swing = (this.sprite.position.x - this.paddleRight.position.x) / 1.8;
        this.sprite.setSpeed(this.maxSpeed, this.sprite.getDirection() + swing);
        // reset collideCounter
        this.collideCounter = 0;
        this.runEvent('rightCollide');
    }
}
Ball.prototype.resetBall = function(dir) {
    if (this.animator != undefined) this.animator.stop();
    this.maxSpeed = 5;
    var ballStartSize = 300;
    var ballEndsize = this.sprite.width;
    var drawBall;
    this.sprite.setSpeed(0, 0);
    this.sprite.position.set(width / 2, height / 2);

    var self = this;
    this.drawingStack.push(function() {
        fill(self.animData['r'], self.animData['g'], self.animData['b'], self.animData['a']);
        ellipse(self.sprite.position.x, self.sprite.position.y, self.animData['width'], self.animData['width']);
    });
    this.animData = {
        r: dir > 0 ? 0 : 255,
        g: dir > 0 ? 255 : 0,
        b: 0,
        a: 0,
        width: ballStartSize
    };
    this.animator = new TWEEN.Tween(this.animData)
        .to({
            r: 255,
            g: 255,
            b: 255,
            a: 255,
            width: ballEndsize
        }, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .start()
        .onComplete(function() {
            self.sprite.setSpeed(self.initSpeed, dir);
            self.drawingStack.pop();
            self.enable();
        })
};
Ball.prototype.draw = function() {
    for (var i = 0; i < this.drawingStack.length; i++) {
        this.drawingStack[i]();
    }
}
Ball.prototype.lose = function() {
    // reset ball and move it the right
    if (this.sprite.position.y > height) {
        // Don't collide with obsctacles
        this.collideWithOthers = false;

        this.sprite.position.x = width / 2;
        this.sprite.position.y = height / 2;
        if (this.enabled) {
            this.runEvent('loose');
        }
        if(this.enabled) this.resetBall(-90);
    }
}
Ball.prototype.win = function() {
    if (this.sprite.position.y < 0) {
        // Don't collide with obsctacles
        this.collideWithOthers = false;
        this.sprite.position.x = width / 2;
        this.sprite.position.y = height / 2;
        if (this.enabled) {
            this.runEvent('win');
        }
        if(this.enabled)  this.resetBall(90);
    }
};