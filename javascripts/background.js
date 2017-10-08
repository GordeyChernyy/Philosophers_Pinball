var Background = function () {
	this.lineCount = 20;
	this.lines = [];
	
	var self = this;

	this.setup = function(){
		for (var i = 0; i < self.lineCount; i++) {
			var x1 = map(i, 0, self.lineCount, -width, width);
			var y1 = 0;
			var x2 = x1 + height;
			var y2 = height;

			self.lines.push( {
				p1 : [x1, y1],
				p2 : [x2, y2],
				color : i % 2 == 0 ? [0, 255, 255, 0] : [255, 255, 255, 0]
			});
		}
	}
	this.draw = function(){
		for (var i = 0; i < self.lines.length; i++) {

			var d = self.lines[i]; 
			var a = noise((frameCount + i*100)/150)*155;
			d.color[3] = a;
			// strokeWeight(2);
			stroke(d.color);

			line(d.p1[0], d.p1[1] , d.p2[0] , d.p2[1]);
			noStroke();
		}
	}
}