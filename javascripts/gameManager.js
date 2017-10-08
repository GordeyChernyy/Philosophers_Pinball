var GameManager = function() {
    this.curEvent;

    var self = this;

    this.events = {
        startScreen: function() {
            self.curEvent = 'startScreen';
            self.runEvent('startScreen');
        },
        startGame: function() {
            self.curEvent = 'startGame';
            self.runEvent('startGame');
        },
        levelScreen: function() {
            self.curEvent = 'levelScreen';
            self.runEvent('levelScreen');
        },
        nextLevel: function() {
            self.curEvent = 'nextLevel';
            self.runEvent('nextLevel');
        },
        endScreen: function() {
            self.runEvent('endScreen');
            self.curEvent = 'endScreen';
        }
    }

    this.onEvents = {
        startScreen: [],
        startGame: [],
        levelScreen: [],
        nextLevel: [],
        endScreen: []
    };

    this.runEvent = function(eventName) {
        for (var i = 0; i < self.onEvents[eventName].length; i++) {
            self.onEvents[eventName][i]();
        }
    }
    this.drawingStack = [];

    this.showStartScreen = function(state) {
        self.createButton({
            // TODO : add more parameters like pos, color
            text: 'PLAY',
            textSize: 20,
            x: width / 2,
            y: height - 100,
            color: [255, 0, 255],
            onComplete: function() {
                self.events['startGame']();
            }
        });
    };

    this.showLevelScreen = function(state) {
        self.events['levelScreen']();
        self.createButton({
            // TODO : add more parameters like pos, color
            text: 'Next',
            x: width / 2,
            y: height - 100,
            textSize: 20,
            color: [255, 0, 255],
            onComplete: function() {
                self.events['nextLevel']();
            }
        });
    };
}
GameManager.prototype.subscribe = function(eventName, func) {
    this.onEvents[eventName].push(func);
};
GameManager.prototype.set = function(state) {
    this.events[state]();
};
GameManager.prototype.draw = function() {
    for (var i = 0; i < this.drawingStack.length; i++) {
        this.drawingStack[i]();
    }
};
GameManager.prototype.createButton = function(data) {
	textFont(candaraFont);
    textSize(data.textSize);
    var border = 20;
    var textW = textWidth(data.text);
    var button = createSprite(data.x, data.y, textW + border * 2, data.textSize + border * 2);
    button.shapeColor = color( data.color);
    var self = this;

    // draw any p5 stuff
    this.drawingStack.push(function() {
        textSize(data.textSize);
        var textPosX = data.x - textW / 2;
        var textPosY = data.y + data.textSize / 3;
        fill(255);
        text(data.text, textPosX, textPosY);
    });

    button.onMousePressed = function() {
        var col = button.shapeColor;
        var animData = {
            r: col.levels[0],
            g: col.levels[1],
            b: col.levels[2],
            width: button.width
        };
        var animator = new TWEEN.Tween(animData)
            .to({
                r: 0,
                g: 0,
                b: 0,
                width: width
            }, 900)
            .easing(TWEEN.Easing.Cubic.Out)
            .start()
            .onUpdate(function() {
                button.shapeColor = color(animData.r, animData.g, animData.b, 255);
                button.width = animData.width;

            })
            .onComplete(function() {
                button.remove();
                delete button;
                self.drawingStack.pop();
                data['onComplete']();
            })
    }
};