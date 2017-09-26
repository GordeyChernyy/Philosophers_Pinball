// ----------------------------------------- Eye
var Eye = function() {
    this.x = 0;
    this.y = 0;
    this.size = 13;
    this.angle = 0.0;
};
Eye.prototype.update = function(mx, my){
    this.angle = atan2(my-this.y, mx-this.x);
};
Eye.prototype.display = function(){
    push();
    translate(this.x, this.y);
    noStroke();
    fill(213, 219, 176);
    ellipse(0, 0, this.size, this.size);
    rotate(this.angle);
    fill(0);
    var _x = 1.5;
    var pos = _x*2;
    ellipse(this.size/pos, 0, this.size/_x, this.size/_x);
    pop();
    push();
    translate(this.x, this.y);
    var _x2 = 3.0;
    var pos2 = _x2*2;
    fill(255, 100);
    ellipse(this.size/pos2, 0, this.size/_x2, this.size/_x2);
    pop();
};
