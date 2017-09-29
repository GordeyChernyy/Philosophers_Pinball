var Rect = function() {
    this.visible = true;
    this.sprite = createSprite();
    this.sprite.immovable = true;
    this.sprite.visible = false;
    this.height = 0;
    this.initWidth = 0;
    this.width = 0;
    this.initHeight = 0;
    this.color = color(random(0, 120), random(23, 120), random(0, 120));
    this.position = new p5.Vector(0, 0);
};
var Quote = function() {
    this.activeColliders = [];
    this.quotes = {};
    this.sprites = [];
    this.textSize = 40;
    this.image;
    this.curQuoteName = 'Dekart';
    this.bounds = new p5.Vector(600, 500); // text area
    this.textPos = new p5.Vector(width / 2 - this.bounds.x / 2, 200); // center to the screen

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
                self.activeColliders.push(visibleSprites[randomIndex].sprite);
            } else {
                // TODO: add progression and events
                for (var i = 0; i < self.sprites.length; i++) {
                    var sprite = self.sprites[i];
                    sprite.visible = true;
                    sprite.sprite.visible = false;
                    self.activeColliders = [];
                }
            }
        }
    };
    this.hideAllQuote = function() {
        // TODO: add progression and events
        for (var i = 0; i < self.sprites.length; i++) {
            var sprite = self.sprites[i];
            sprite.visible = true;
            sprite.sprite.visible = false;
            self.activeColliders = [];
        }
    }
}
Quote.prototype.onQuoteReveal = function(func) {
    this.onQuoteRevealFunc.push(func);
};
Quote.prototype.reset = function(func) {
    this.onQuoteRevealFunc.push(func);
};
Quote.prototype.setupSprites = function() {
    var x = this.textPos.x;
    var y = this.textPos.y;

    textSize(this.textSize);
    for (var i = 0; i < this.quotes[this.curQuoteName].length; i++) {
        var txt = this.quotes[this.curQuoteName][i];
        var w = textWidth(txt);
        var sprite = new Rect();
        sprite.initWidth = w;
        sprite.initHeight = this.textSize;
        sprite.width = w;
        sprite.height = this.textSize + 10;
        sprite.sprite.width = w;
        sprite.sprite.height = sprite.height;
        // set collider pos
        var pos = toCornerPos(sprite, x, y);
        sprite.sprite.position.set(pos[0], pos[1]);
        sprite.x = x;
        sprite.y = y;

        this.sprites.push(sprite);

        x += textWidth(txt);

        if (x > this.textPos.x + this.bounds.x) {
            x = this.textPos.x;
            y += this.textSize + 10;
        }
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
    textSize(this.textSize);


    for (var i = 0; i < this.quotes[this.curQuoteName].length; i++) {
        var txt = this.quotes[this.curQuoteName][i];
        var sprite = this.sprites[i];


        if (!sprite.visible) {
            fill(sprite.color);
            rect(sprite.x, sprite.y -sprite.sprite.height, sprite.sprite.width , sprite.sprite.height);
            fill(255);
            text(txt, sprite.x, sprite.y);
        }
    }
};
// convert from play centered (whyyyyy?) to corner coordinate
function toCornerPos(sprite, posx, posy) {
    return [posx + sprite.initWidth / 2, posy - sprite.initHeight / 2];
}