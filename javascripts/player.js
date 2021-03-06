// Example how to add new character
// player.addCharacter({
//     name : 'Dekart',
//     faceNormal : image,
//     faceWin : image,
//     faceLose : image,
//     eyeImage : image,
//     faceOffset : p5.Vector(0, 0),
//     eyeLPos : p5.Vector(0, 0),
//     eyeRPos : p5.Vector(0, 0),
// })
// ---------------------- CHARACTER -------------------------
var Character = function(data) {
    this.name = data['name'];
    this.face = createSprite();
    this.face.addImage('normal', data['faceNormal']);
    this.face.addImage('loose', data['faceLose']);
    this.face.addImage('win', data['faceWin']);

    this.face.offsetInit = new p5.Vector(data['faceOffset'].x, data['faceOffset'].y);
    this.face.offset = new p5.Vector(data['faceOffset'].x, data['faceOffset'].y);
    this.face.timer = 0;
    this.eyeL = new Eye(data['eyeImage'], calcEyeOffset(this.face, data['eyeLPos'].x, data['eyeLPos'].y));
    this.eyeR = new Eye(data['eyeImage'], calcEyeOffset(this.face, data['eyeRPos'].x, data['eyeRPos'].y));
    this.eyeL.sprite.depth -= this.face.depth + 1;
    this.eyeR.sprite.depth -= this.face.depth + 2;
}
Character.prototype.destroy = function() {
    delete this.face.remove();
    delete this.eyeL.destroy();
    delete this.eyeR.destroy();
}
Character.prototype.update = function(pos, targetPos) {
    this.face.position.y = height - this.face.offset.y;
    this.face.velocity.x = (mouseX + this.face.offset.x - this.face.position.x) / 10;

    this.eyeL.setLookAt(targetPos.x, targetPos.y);
    this.eyeL.setPos(this.face.position.x, this.face.position.y);
    this.eyeR.setLookAt(targetPos.x, targetPos.y);
    this.eyeR.setPos(this.face.position.x, this.face.position.y);

    // update timer for faces
    if (this.face.timer == 0) {
        this.face.changeImage('normal');
    }
    this.face.timer--;
};
// ---------------------- PLAYER -------------------------
var Player = function() {
    this.characterData = [];
    this.curCharacterNum = 0;
    this.handVelX = 0;
    this.enabled = false;
    // this.hand.debug = true;

    // Create Event. Set function as a var to pass it somewhere, should run once
    var self = this; // correct scope to use global variables
    this.onLoose = function() {
        self.getCurCharacter().face.changeImage('loose');
        self.getCurCharacter().timer = 60;
    }
    this.onWin = function() {
        self.getCurCharacter().face.changeImage('win');
        self.getCurCharacter().face.timer = 60;
    }
    this.nextPlayer = function() {
        self.curCharacterNum++;
        if (self.curCharacterNum > self.characterData.length - 1) {
            self.curCharacterNum = 0;
        }
        self.setCharacter();
    }
    this.fadeIn = function() {
        self.hand.immovable = true;
        self.enable();
        self.getCurCharacter().face.offset.y = -100;
        var animator = new TWEEN.Tween(self.getCurCharacter().face.offset)
            .to({
                y: self.getCurCharacter().face.offsetInit.y
            }, 1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .start()
    }
    this.fadeOut = function() {
        self.hand.immovable = false;
        var animator = new TWEEN.Tween(self.getCurCharacter().face.offset)
            .to({
                y: -100
            }, 1000)
            .easing(TWEEN.Easing.Cubic.In)
            .start()
            .onComplete(function() {
                self.disable();
            })
    }
    this.enable = function() {
        self.enabled = true;
        self.hand.visible = true;
    }
    this.disable = function() {
        self.enabled = false;
        self.hand.visible = false;
    }
    this.setCharacter = function() {
        if (self.character != undefined) {
            self.character.destroy();
            delete self.character;
        }
        self.character = new Character(self.characterData[self.curCharacterNum]);
        self.correctDepth();
    }

    this.onEvents = {
        lastPlayer: []
    };

    this.runEvent = function(eventName) {
        for (var i = 0; i < self.onEvents[eventName].length; i++) {
            self.onEvents[eventName][i]();
        }
    }
};
Player.prototype.isLastPlayer = function() {
    return this.curCharacterNum === this.characterData.length - 1? true : false;

};
Player.prototype.subscribe = function(eventName, func) {
    this.onEvents[eventName].push(func);
};
Player.prototype.addCharacterData = function(data) {
    this.characterData.push(data);
};


Player.prototype.getCurCharacter = function() {
    return this.character;
};
Player.prototype.correctDepth = function() {
    this.hand.depth = 1 + this.character.face.depth;
};

Player.prototype.getPaddle = function() {
    return this.hand;
};

Player.prototype.addHand = function(image) {
    this.hand = createSprite();
    this.hand.position = new p5.Vector(height, width / 2);
    this.hand.visible = false;
    this.hand.offset = new p5.Vector(20, -50);
    this.hand.immovable = true;
    this.hand.addImage(image);
};

Player.prototype.updateHand = function(pos, targetPos) {
    if (mouseY < height - 100) {
        this.hand.velocity.y = (height - 100 + this.hand.offset.y - this.hand.position.y) / 5;
    } else {

        this.hand.velocity.y = (mouseY + this.hand.offset.y - this.hand.position.y) / 5;
    }
    this.hand.position.x = mouseX + this.hand.offset.x;

    // set velocity to uset it on ball acceleration
    this.handVelX = Math.abs(this.hand.velocity.y);
};

Player.prototype.update = function(pos, targetPos) {
    if (this.enabled) {
        this.updateHand(pos, targetPos);
        this.getCurCharacter().update(pos, targetPos);
    }
};

function calcEyeOffset(img, posx, posy) {
    return new p5.Vector(posx - img.width / 2, posy - img.height / 2);
}