// face sprites should be always aligned with eyes because eyes pos is depends on eyes with

var Player = function() {
    this.face = createSprite();
    this.face.offset = new p5.Vector(0, -130);
    this.face.timer = 0; // for animation change
    this.hand = createSprite();
    this.hand.offset = new p5.Vector(59, -129 / 2);
    this.hand.immovable = true;
    this.handVelX = 0;
    // this.hand.debug = true;

    // Create Event. Set function as a var to pass it somewhere, should run once
    var self = this; // correct scope to use global variables
    this.onLoose = function() {
        self.face.changeImage('loose');
        self.face.timer = 60;
    }
    this.onWin = function() {
        self.face.changeImage('win');
        self.face.timer = 60;
    }
}
Player.prototype.getPaddle = function() {
    return this.hand;
}

Player.prototype.setupEyes = function(image, posL, posR) {
    this.eyeL = new Eye(image, calcEyeOffset(this.face, posL.x, posL.y));
    this.eyeR = new Eye(image, calcEyeOffset(this.face, posR.x, posR.y));
    this.eyeL.sprite.depth -= this.face.depth + 1;
    this.eyeR.sprite.depth -= this.face.depth + 2;
}

function calcEyeOffset(img, posx, posy) {
    return new p5.Vector(posx - img.width / 2, posy - img.height / 2);
}
Player.prototype.addFaceImage = function(label, image) {
    this.face.addImage(label, image);
}
Player.prototype.addHandImage = function(image) {
    this.hand.addImage(image);
}
Player.prototype.update = function(pos, targetPos) {
    // update pos
    // this.face.velocity.x = (mouseX-this.face.position.x)/10;
    this.face.position.y = height - 100;
    this.face.velocity.x = (mouseX + this.face.offset.x - this.face.position.x) / 10;

    if (mouseY < height - 100) {
        this.hand.velocity.y = ( height - 100 + this.hand.offset.y - this.hand.position.y) / 5;
    }else{
        
        this.hand.velocity.y = ( mouseY + this.hand.offset.y - this.hand.position.y) / 5;
    }
    this.hand.position.x = mouseX + this.hand.offset.x;
    
    // set velocity to uset it on ball acceleration
    this.handVelX = Math.abs(this.hand.velocity.y);

    this.eyeL.setLookAt(targetPos.x, targetPos.y);
    this.eyeL.setPos(this.face.position.x, this.face.position.y);
    this.eyeR.setLookAt(targetPos.x, targetPos.y);
    this.eyeR.setPos(this.face.position.x, this.face.position.y);

    // update timer for faces
    if (this.face.timer == 0) {
        this.face.changeImage('normal');
    }
    this.face.timer--;
}