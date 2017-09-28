// face sprites should be always aligned with eyes because eyes pos is depends on eyes with

var Player = function() {
    this.face = createSprite();
    this.face.timer = 0; // for animation change
    this.face.immovable = true;
    this.hand = createSprite();

    // Create Event. Set function as a var to pass it somewhere, should run once
    var self = this; // correct scope to use global variables
    this.onLoose = function(){
    	self.face.changeImage('loose');
    	self.face.timer = 60;
    }
    this.onWin = function(){
    	self.face.changeImage('win');
    	self.face.timer = 60;
    }
}
Player.prototype.getPaddle = function(){
	return this.face;
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
    this.face.position.set(pos);
    this.eyeL.setLookAt(targetPos.x, targetPos.y);
    this.eyeL.setPos(pos.x, pos.y);
    this.eyeR.setLookAt(targetPos.x, targetPos.y);
    this.eyeR.setPos(pos.x, pos.y);

    // update timer for faces
    if (this.face.timer == 0) {
    	this.face.changeImage('normal');
    }
    this.face.timer--;
}