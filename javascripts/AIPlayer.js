var AIPlayer = function() {
    this.smooth = 0.97;
    this.sprite = createSprite(windowWidth - 10, windowHeight, 10, 100);
    this.sprite.immovable = true;
    this.pos = new p5.Vector(windowWidth - 20, windowHeight/2);
}
AIPlayer.prototype.getPaddle = function() {
	return this.sprite;
};
AIPlayer.prototype.update = function(target) {
	// calculate follow the target
	var isTargetClose = target.x > windowWidth / 2 ? true : false;
	var randomTarget = noise(frameCount/100.0)*windowHeight;
	var targetPos = isTargetClose ? target.y : randomTarget;
    this.pos.y = this.pos.y * this.smooth + targetPos * (1 - this.smooth); // xeno smooth
    
    // set position
    this.sprite.position.set([this.pos.x, this.pos.y]);
};