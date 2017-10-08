var WordBlock = function() {
    this.text;
    this.visible = false;
    this.isSolve = false;
    // sprite used as a collider
    this.sprite = createSprite();
    this.sprite.immovable = true;
    this.sprite.visible = false;
    // position
    this.x = 0;
    this.y = 0;
    this.seed = random(0, 5000);
    this.height = 0;
    this.width = 0;
    this.initWidth = 0;
    this.initHeight = 0;
    this.color = color(random(0, 120), random(23, 120), random(0, 120));
    this.position = new p5.Vector(0, 0);
    this.timer = 20;
    this.drawAnimation = function() {};
};
WordBlock.prototype.reset = function() {
    this.timer = 20;
};
WordBlock.prototype.solve = function() {
    this.isSolve = true;
    var self = this;
    var dir = random(-1, 1);
    var animator = new TWEEN.Tween(this.sprite.position)
        .to({
            x: dir > 0 ? width + self.sprite.width : -self.sprite.width
        }, random(500, 700))
        .delay(random(0, 1000))
        .easing(TWEEN.Easing.Cubic.In)
        .start()

};
WordBlock.prototype.draw = function() {
    if (this.sprite.visible) {

        fill(this.color);
        // noStroke();
        // rect(this.x, this.y - this.sprite.height, this.sprite.width, this.timer < 0 ? this.sprite.height : height);
        var sprite = this.sprite;

        this.timer--;
        var a = this.isSolve ?
            map(noise((frameCount + this.seed) / 90), 0, 1, 0, 255) :
            map(sprite.width, 0, sprite.initWidth, 0, 255);
        fill(255, a);
        text(this.text, this.x, this.y);
    }

    this.drawAnimation();
};
WordBlock.prototype.show = function() {
    var self = this;

    this.drawAnimation = function() {
        var x = self.animData['x'];
        var y = self.animData['y'];
        var height = self.animData['height'];
        fill(self.sprite.shapeColor);
        noStroke();
        rect(x, y - self.sprite.height, self.sprite.width, height);
    }
    this.animData = {
        x: this.x,
        y: height,
        alpha: 0,
        height: 600
    };
    this.animator = new TWEEN.Tween(this.animData)
        .to({
            x: self.x,
            y: self.y,
            alpha: 255,
            height: self.sprite.initHeight
        }, random(500, 700))
        .easing(TWEEN.Easing.Cubic.Out)
        .start()
        .onStop(function() {
            print('stopAnimation');
            self.drawAnimation = function() {};
        })
        .onComplete(function() {
            self.drawAnimation = function() {};
            self.sprite.visible = true;
            self.sprite.width = self.sprite.initWidth;
            self.sprite.height = self.sprite.initHeight;
        })

};
WordBlock.prototype.hide = function() {
    if (this.animator != undefined)
        this.animator.stop();
    this.sprite.visible = false;
    this.sprite.width = this.sprite.initWidth;
    this.sprite.height = this.sprite.initHeight;
};

WordBlock.prototype.destroy = function() {
    if (this.animator != undefined)
        this.animator.stop();
    delete this.animator;
    this.sprite.remove();
    delete this.sprite;
    delete this.position;
    delete this.color;
};
// -------------------------------- QUOTE BLOCK ---------------------------------------

var QuoteBlock = function(data) {
    // lines of words
    this.name = data['name'];
    this.strings = [];
    this.textSize = data['textSize'];
    this.bounds = new p5.Vector(600, 500); // text area
    this.textPos = new p5.Vector(width / 2 - this.bounds.x / 2, 200); // center to the screen
    // blocks
    this.wordBlocks = [];
    // setup
    this.setup(data['strings']);
}
QuoteBlock.prototype.destroy = function() {
    for (var i = 0; i < this.wordBlocks.length; i++) {
        this.wordBlocks[i].destroy();
        delete this.wordBlocks[i];
    }
    delete this.textPos;
    delete this.bounds;
};
QuoteBlock.prototype.setup = function(strings) {
    this.strings = strings;

    var x = this.textPos.x;
    var y = this.textPos.y;

    textSize(this.textSize);
    for (var i = 0; i < this.strings.length; i++) {
        var txt = this.strings[i];

        var w = textWidth(txt);

        // create block
        var block = new WordBlock();
        block.text = txt;
        block.initWidth = w;
        block.initHeight = this.textSize;
        block.width = w;
        block.height = this.textSize + 10;
        block.sprite.width = w;
        block.sprite.height = block.height;
        // set collider pos
        var pos = toCornerPos(block, x, y);

        // sprite
        var sprite = block.sprite;
        sprite.initWidth = sprite.width;
        sprite.initHeight = sprite.height;

        block.sprite.position.set(pos[0], pos[1]);
        block.x = x;
        block.y = y;

        this.wordBlocks.push(block);

        x += textWidth(txt);

        if (x > (this.textPos.x + this.bounds.x - w)) {
            x = this.textPos.x;
            y += this.textSize + 10;
        }
    }
    this.textHeight = y;
};

QuoteBlock.prototype.getInvisibleBlocks = function() {
    var blocks = [];
    for (var i = 0; i < this.wordBlocks.length; i++) {
        if (!this.wordBlocks[i].sprite.visible) {
            blocks.push(this.wordBlocks[i]);
        }
    }
    return blocks;
};
QuoteBlock.prototype.getVisibleBlocks = function() {
    var blocks = [];
    for (var i = 0; i < this.wordBlocks.length; i++) {
        if (this.wordBlocks[i].sprite.visible) {
            blocks.push(this.wordBlocks[i]);
        }
    }
    return blocks;
};
QuoteBlock.prototype.hideAllBlocks = function() {
    for (var i = 0; i < this.wordBlocks.length; i++) {
        this.wordBlocks[i].visible = false;
        var sprite = this.wordBlocks[i].sprite;
        sprite.visible = false;
        sprite.width = sprite.initWidth;
        sprite.height = sprite.initHeight;
        this.wordBlocks[i].reset();
    }
};
QuoteBlock.prototype.draw = function() {
    textSize(this.textSize);
    for (var i = 0; i < this.wordBlocks.length; i++) {
        var block = this.wordBlocks[i];
        block.draw();
    }
};
QuoteBlock.prototype.solve = function() {
    for (var i = 0; i < this.wordBlocks.length; i++) {
        var block = this.wordBlocks[i];
        block.solve();
    }
};
// -------------------------------- QUOTE ---------------------------------------
var Quote = function() {
    this.activeColliders = [];
    // quote block
    this.quoteBlock;
    this.quoteBlockData = [];
    this.curQuoteBlockDataNum = 0;

    var self = this;

    // delegate emulation
    this.onQuoteRevealFunc = [];
    this.onQuoteSolveFunc = [];

    this.revealWord = function() {
        if (self.quoteBlock != undefined) {
            // collect invisible blocks
            var invisibleBlocks = self.getCurQuoteBlock().getInvisibleBlocks();

            if (invisibleBlocks.length > 1) {
                var randomIndex = int(random(0, invisibleBlocks.length));
                invisibleBlocks[randomIndex].show();
                self.activeColliders.push(invisibleBlocks[randomIndex].sprite);
            } else {
                if (invisibleBlocks.length > 0) {
                    invisibleBlocks[0].show();
                }
                self.getCurQuoteBlock().solve();
                self.runEvent('solveQuote');
            }
        }
    };
    this.hideWord = function() {
        if (self.quoteBlock != undefined) {
            var visibleBlocks = self.getCurQuoteBlock().getVisibleBlocks();
            // hide random sprite
            if (visibleBlocks.length > 0) {
                var randomIndex = int(random(0, visibleBlocks.length));
                visibleBlocks[randomIndex].hide();
                visibleBlocks[randomIndex].reset();
                // remove current block from colliders
                var index = self.activeColliders.indexOf(visibleBlocks[randomIndex].sprite);
                self.activeColliders.splice(index, 1);
            }
        }
    };
    this.hideAllQuote = function() {
        self.activeColliders = [];
        self.getCurQuoteBlock().hideAllBlocks();
    }

    this.nextQuote = function() {
        self.curQuoteBlockDataNum++;
        if (self.curQuoteBlockDataNum > self.quoteBlockData.length - 1) {
            self.curQuoteBlockDataNum = 0;
        }
        self.createQuote();
    }

    this.onEvents = {
        solveQuote: []
    };

    this.runEvent = function(eventName) {
        for (var i = 0; i < self.onEvents[eventName].length; i++) {
            self.onEvents[eventName][i]();
        }
    }
}
Quote.prototype.getAutorName = function() {
    return this.getCurQuoteBlock().name;
}
Quote.prototype.getTextHeight = function() {
    return this.getCurQuoteBlock().textHeight;
}
Quote.prototype.getTextBounds = function() {
    return this.getCurQuoteBlock().bounds;
}
Quote.prototype.subscribe = function(eventName, func) {
    this.onEvents[eventName].push(func);
};

Quote.prototype.getCurQuoteBlock = function() {
    return this.quoteBlock;
}

Quote.prototype.add = function(data) {
    this.quoteBlockData.push(data);
};

Quote.prototype.createQuote = function() {
    if (this.quoteBlock != undefined) {
        this.activeColliders = [];
        this.quoteBlock.destroy();
        delete this.quoteBlock;
    }

    this.quoteBlock = new QuoteBlock(this.quoteBlockData[this.curQuoteBlockDataNum]);
};

Quote.prototype.draw = function() {
    this.getCurQuoteBlock().draw();
};
// convert from play centered (whyyyyy?) to corner coordinate
function toCornerPos(sprite, posx, posy) {
    return [posx + sprite.initWidth / 2, posy - sprite.initHeight / 2];
}