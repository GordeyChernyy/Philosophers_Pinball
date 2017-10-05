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
            text: 'play',
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
    var button = createSprite(width / 2, height / 2, 200, 50);
    var self = this;

    // draw any p5 stuff
    this.drawingStack.push(function() {
        textSize(20);
        text(data['text'], width / 2, height / 2);
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