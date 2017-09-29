var AIPlayer = function() {
    this.smooth = 0.95;
    this.sprite = createSprite(width - 10, height, 10, 100);
    this.paddleSprite = createSprite(0 , 0, 100, 10);
    this.paddleSprite.immovable = true;

    this.sprite.rotationSpeed = 1.5;
    this.pos = new p5.Vector(width/2, 30);
}
AIPlayer.prototype.getPaddle = function() {
	return this.paddleSprite;
};
AIPlayer.prototype.update = function(target) {
	// calculate follow the target

	var isTargetClose = target.y < width / 2 ? true : false;
	var randomTarget = noise(frameCount/100.0)*width;
	var targetPos = isTargetClose ? target.x + noise(frameCount/100)*20 : randomTarget;
    this.pos.x = this.pos.x * this.smooth + targetPos * (1 - this.smooth); // xeno smooth
    
    // set position
    this.sprite.position.set([this.pos.x, this.pos.y]);
    this.paddleSprite.position.set([this.pos.x, this.pos.y]);
};