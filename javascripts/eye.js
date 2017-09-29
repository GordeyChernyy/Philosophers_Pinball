// ----------------------------------------- Eye
var Eye = function(image, posOffset) {
    this.sprite = createSprite(20, 20);
    this.sprite.addImage(image);
    this.posOffset = posOffset; // offset should be defined according to sprite pos
    this.size = 13;
    this.angle = 0.0;
};
Eye.prototype.destroy = function(){
    this.sprite.remove();
}
Eye.prototype.setLookAt = function(mx, my){
    this.angle = atan2(my-this.sprite.position.y, mx-this.sprite.position.x);
    this.sprite.rotation = this.angle *180 / Math.PI;
};
Eye.prototype.setPos = function(posx, posy){
    var x = this.posOffset.x + posx;
    var y = this.posOffset.y + posy;
    this.sprite.position.set([x, y]);
};

