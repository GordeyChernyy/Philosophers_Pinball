var Quote = function() {
    this.quotes = {};
    this.sprites = [];
    this.textSize = 30;
    this.curQuoteName = 'Dekart';
    this.sprite = createSprite();
    this.bounds = new p5.Vector(170, 500); // text area
    this.textPos = new p5.Vector(width / 2 - this.bounds.x / 2, 100); // center to the screen

    var self = this;
    this.onQuoteRevealFunc = []; // delegate

    this.revealWord = function() {
        if (self.sprites.length > 0) {
            var visibleSprites = []; // collect all visible sprites
            for (var i = 0; i < self.sprites.length; i++) {
                var sprite = self.sprites[i];
                if (sprite.visible) {
                    visibleSprites.push(sprite);
                }
            }
            if (visibleSprites.length > 0) { // hide random sprite
                var randomIndex = int(random(0, visibleSprites.length));
                visibleSprites[randomIndex].visible = false;
            } else {
                // TODO: add progression and events
                for (var i = 0; i < self.sprites.length; i++) {
                    var sprite = self.sprites[i];
                    sprite.visible = true;
                }
            }
        }
    };
    this.hideAllQuote = function() {
        // TODO: add progression and events
        for (var i = 0; i < self.sprites.length; i++) {
            var sprite = self.sprites[i];
            sprite.visible = true;
        }
    }
}
Quote.prototype.onQuoteReveal = function(func) {
    this.onQuoteRevealFunc.push(func);
};
Quote.prototype.setupSprites = function() {
    textSize(this.textSize);
    for (var i = 0; i < this.quotes[this.curQuoteName].length; i++) {
        var txt = this.quotes[this.curQuoteName][i];
        var w = textWidth(txt);
        var sprite = createSprite(0, 0, w, this.textSize);
        sprite.initWidth = w;
        sprite.initHeight = this.textSize;
        sprite.width = w;
        sprite.height = this.textSize + 10;
        this.sprites.push(sprite);
    }
};
Quote.prototype.setQuotes = function(quotes) {
    this.quotes = quotes;
    for (var i = 0; i < this.quotes['Dekart'].length; i++) {
        console.log(this.quotes['Dekart'][i]);
    }
    this.setupSprites();
}
Quote.prototype.draw = function() {
    fill(255);
    textSize(this.textSize);

    // this.sprite.width = textWidth("It is");
    // this.sprite.height = 20;

    var x = this.textPos.x;
    var y = this.textPos.y;
    var lineWidth = 0;

    for (var i = 0; i < this.quotes[this.curQuoteName].length; i++) {
        var txt = this.quotes[this.curQuoteName][i];

        text(txt, x, y);

        var sprite = this.sprites[i];
        var spritePos = toCornerPos(sprite, x, y);
        sprite.position.set(spritePos[0], spritePos[1]);

        x += textWidth(txt);

        if (x > this.textPos.x + this.bounds.x) {
            x = this.textPos.x;
            y += this.textSize + 10;
        }
    }
    // var pos = toCornerPos(this.sprite, this.textPos);
    // this.sprite.position.set(pos[0], pos[1]);
};
// convert from play centered (whyyyyy?) to corner coordinate
function toCornerPos(sprite, posx, posy) {
    return [posx + sprite.initWidth / 2, posy - sprite.initHeight / 2];
}