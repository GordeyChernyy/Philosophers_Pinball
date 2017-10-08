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
    this.drawingStack = {};

    this.showStartScreen = function(state) {
        self.createButton({
            // TODO : add more parameters like pos, color
            text: 'YES',
            textSize: 20,
            x: width / 2,
            y: height / 2 + 100,
            color: [255, 0, 255],
            onComplete: function() {
                self.events['startGame']();
                self.deleteFromStack('logo');
            }
        });
        self.drawingStack['logo'] = function() {
            fill(255);
            textAlign(CENTER);
            textSize(50);
            text("PHILOSOPHERS PONG", width / 2, height / 2 - 50);
            textSize(20);
            text("Kick chaos's ass to reveal philosopher idea!", width / 2, height / 2);
            textAlign(LEFT);
        };

    };
    this.checkPlayer = function() {
        if (player.isLastPlayer()) {
            self.showEndScreen();
        } else {
            self.showLevelScreen();
        }
    }
    this.showLevelScreen = function() {

        self.events['levelScreen']();
        var x = width / 2 - quote.getTextBounds().x / 2;
        var y = quote.getTextHeight() + 20;
        self.createButton({
            // TODO : add more parameters like pos, color
            text: 'Next',
            x: width / 2,
            y: y + 100,
            textSize: 20,
            color: [255, 0, 255],
            onComplete: function() {
                self.events['nextLevel']();
                self.deleteFromStack('autorName');
            }
        });
        self.drawingStack['autorName'] = function() {
            fill(255);
            textAlign(RIGHT);
            textSize(20);
            text(quote.getAutorName(), x, quote.getTextHeight(), quote.getTextBounds().x, 100);
            textAlign(LEFT);
        };

    };

    this.showEndScreen = function(state) {
        self.events['endScreen']();
        var x = width / 2 - quote.getTextBounds().x / 2;
        var y = quote.getTextHeight() + 20;

        self.createButton({
            // TODO : add more parameters like pos, color
            text: 'LET"S DO IT AGAIN!',
            textSize: 20,
            x: width / 2,
            y: y + 100,
            color: [255, 0, 255],
            onComplete: function() {
                self.events['nextLevel']();
                self.deleteFromStack('gameOver');
            }
        });
        self.drawingStack['gameOver'] = function() {
            fill(255);
            textSize(20);
            textAlign(RIGHT);
            text(quote.getAutorName(), x, quote.getTextHeight(), quote.getTextBounds().x, 100);
            textSize(30);
            textAlign(CENTER);
            text("Thank you for playing!", width / 2, y + 50);
            textAlign(LEFT);
        };

    };
}
GameManager.prototype.subscribe = function(eventName, func) {
    this.onEvents[eventName].push(func);
};
GameManager.prototype.set = function(state) {
    this.events[state]();
};
GameManager.prototype.draw = function() {
    for (var prop in this.drawingStack) {
        this.drawingStack[prop]();
    }
};
GameManager.prototype.createButton = function(data) {
    textFont(candaraFont);
    textSize(data.textSize);
    var border = 20;
    var textW = textWidth(data.text);
    var button = createSprite(data.x, data.y, textW + border * 2, data.textSize + border * 2);
    button.shapeColor = color(data.color);
    var self = this;

    // draw any p5 stuff
    this.drawingStack['button'] = function() {
        textSize(data.textSize);
        var textPosX = data.x - textW / 2;
        var textPosY = data.y + data.textSize / 3;
        fill(255);
        text(data.text, textPosX, textPosY);
    };

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
                data['onComplete']();
                button.remove();
                delete button;
                self.deleteFromStack('button');
            })
    }
};

GameManager.prototype.deleteFromStack = function(funcName) {
    delete this.drawingStack[funcName];
}