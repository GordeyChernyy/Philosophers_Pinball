var AIPlayer = function() {
    this.smooth = 0.99;
    this.extraSpriteCount = 3;
    this.sprites = [];
    this.paddleSprite = createSprite(0, 0, 100, 10);
    this.paddleSprite.immovable = true;
    this.pos = new p5.Vector(width / 2, 30);
}
AIPlayer.prototype.getPaddle = function() {
    return this.paddleSprite;
};
AIPlayer.prototype.addImages = function(images) {
    for (var i = 0; i < images.length; i++) {
        var sprite = createSprite();
        sprite.addImage('plain', images[i][0]);
        sprite.addImage('blink', images[i][1]);
        sprite.timer = 0;
        sprite.rotationSpeed = random(0.3, 1.2);
        this.sprites.push(sprite);
    }
    // add extra
    for (var i = 0; i < this.extraSpriteCount; i++) {
        var randomIndex = int(random(0, images.length-1));
        var sprite = createSprite();
        sprite.addImage('plain', images[randomIndex][0]);
        sprite.addImage('blink', images[randomIndex][1]);
        sprite.timer = 0;
        sprite.rotationSpeed = random(0.3, 1.2);
        this.sprites.push(sprite);
    }
    this.paddleSprite.depth = this.sprites[this.sprites.length-1].depth+1;
}
AIPlayer.prototype.update = function(target) {
    // calculate follow the target

    var isTargetClose = target.y < width / 2 ? true : false;
    var randomTarget = noise(frameCount / 100.0) * width;
    var targetPos = isTargetClose ? target.x + noise(frameCount / 100) * 20 : randomTarget;
    this.pos.x = this.pos.x * this.smooth + targetPos * (1 - this.smooth); // xeno smooth

    // set position
    for (var i = 0; i < this.sprites.length; i++) {
        var sprite = this.sprites[i];
        var offsetX = noise((frameCount+i*40) / 200.0)*100;
        var offsetY = noise((frameCount+i*30) / 200.0)*100;
        sprite.position.set([this.pos.x+offsetX, this.pos.y+offsetY]);
        sprite.timer++;
        if(sprite.timer % int(random(12, 22)) ==  0 ){
            var label = sprite.getAnimationLabel();
            if(label==='plain'){
                sprite.changeImage('blink');
            }else{
                sprite.changeImage('plain');
            }
        }
        sprite.scale = noise((frameCount+i*70)/200.0)*0.5 + 0.5;
    }
    this.paddleSprite.position.set([this.pos.x, this.pos.y]);
};