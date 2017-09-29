var AIPlayer = function() {
    this.smooth = 0.97;
    this.sprite = createSprite(width - 10, height, 10, 100);
    this.paddleSprite = createSprite(width - 10, height, 10, 100);
    this.paddleSprite.immovable = true;

    this.sprite.rotationSpeed = 1.5;
    this.pos = new p5.Vector(width - 20, height/2);
}
AIPlayer.prototype.getPaddle = function() {
	return this.paddleSprite;
};
AIPlayer.prototype.update = function(target) {
	// calculate follow the target

	var isTargetClose = target.x > width / 2 ? true : false;
	var randomTarget = noise(frameCount/100.0)*height;
	var targetPos = isTargetClose ? target.y  + noise(frameCount/100)*20 : randomTarget;
    this.pos.y = this.pos.y * this.smooth + targetPos * (1 - this.smooth); // xeno smooth
    
    // set position
    this.sprite.position.set([this.pos.x, this.pos.y]);
    this.paddleSprite.position.set([this.pos.x, this.pos.y]);
};