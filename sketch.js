// canvas
var canvas;
var width;
var height;

// player
var playerPos;
var player;

// text
var quote;
var quoteStrings;

// images
var eyeImage, rectImage, handImg;


// sounds
var soundPlayer;
var looseSound, winSound, pongHitSound, pongWallSound;

// kant
var kantPlain, kantSad, kantHappy;
var kantSprite;

// AIPlayer 
var aiPlayer;
var chaosImage;

// ball
var ball, ballImage;
var wallTop, wallBottom;

function preload() {
    // text
    quoteStrings = {};
    quoteStrings['Dekart'] = loadStrings('Assets/text/quoteDekart1.txt');
    // sounds
    looseSound = loadSound('Assets/sounds/pLoose.mp3');
    winSound = loadSound('Assets/sounds/pWin.mp3');
    pongHitSound = loadSound('Assets/sounds/ballHit.mp3');
    pongWallSound = loadSound('Assets/sounds/ballTable.mp3');
    // images
    rectImage = loadImage('Assets/images/rect_10px.png');
    handImg = loadImage('Assets/images/hand.png');
    eyeImage = loadImage('Assets/images/eye.png');
    kantPlain = loadImage('Assets/images/kant.png');
    kantSad = loadImage('Assets/images/kant_sad.png');
    kantHappy = loadImage('Assets/images/kant_happy.png');
    ballImage = loadImage('Assets/images/circle_15px.png');
    chaosImage = loadImage('Assets/images/chaos2.png');
}
// -------------
//     SETUP
// -------------
function setup() {
    canvas = createCanvas(1000, 640);
    canvas.parent('myContainer');
    width = canvas.width;
    height = canvas.height;

    setupQuote();
    setupSoundPlayer();
    setupWalls();
    setupAIPlayer();
    setupPlayer();
    setupBall();
}

function setupQuote(argument) {
    quote = new Quote();
    quote.image = rectImage;
    quote.setQuotes(quoteStrings);
}

function setupSoundPlayer() {
    soundPlayer = new SoundPlayer();
    // collect sounds in soundPlayer
    soundPlayer.add('looseSound', looseSound);
    soundPlayer.add('winSound', winSound);
    soundPlayer.add('pongHitSound', pongHitSound);
    soundPlayer.add('pongWallSound', pongWallSound);
}

function setupAIPlayer() {
    aiPlayer = new AIPlayer();
    aiPlayer.sprite.addImage(chaosImage);

}


function setupWalls() { // define walls here becuase we can have two balls but walls will be the same
    wallTop = createSprite(-30 / 2, height / 2,  30, height);
    wallTop.immovable = true; // should collide with ball
    wallBottom = createSprite(width + 30/2, height/2 , 30, height);
    wallBottom.immovable = true; // should collide with ball
}

function setupPlayer() {
    playerPos = new p5.Vector(100, 0);

    player = new Player();
    // add images, labels always should be 'normal' 'loose' 'win' to match events
    player.addFaceImage('normal', kantPlain);
    player.addFaceImage('loose', kantSad);
    player.addFaceImage('win', kantHappy);
    player.hand.addImage(handImg);
    // create eyes
    player.setupEyes(eyeImage, new p5.Vector(71, 54), new p5.Vector(99, 54)); // eye pos in px mesured in photoshop according to sprite
    // subscribe to event when ball loose
}

function setupBall() {
    // setup ball
    ball = new Ball(ballImage);
    // pass all collider to ball
    ball.wallTop = wallTop;
    ball.wallBottom = wallBottom;
    ball.paddleRight = aiPlayer.getPaddle(); // using getPaddle we can return any collided part of the player body (ex. hand or head )
    ball.paddleLeft = player.getPaddle();
    // subscribe to ball events, pass the function as variable that should run on any ball event
    ball.onLoose(player.onLoose);
    ball.onWin(player.onWin);
    // subscribe sounds to ball events
    ball.onLoose(soundPlayer.play['looseSound']);
    ball.onWin(soundPlayer.play['winSound']);
    ball.onLeftCollide(soundPlayer.play['pongHitSound']);
    ball.onRightCollide(soundPlayer.play['pongHitSound']);
    ball.onWallCollide(soundPlayer.play['pongWallSound']);
    // quote 
    ball.onLeftCollide(quote.revealWord);
    ball.onLoose(quote.hideAllQuote);
}
// -------------
//     UPDATE
// -------------
function draw() {
    background(0, 0, 0);

    updatePlayer();
    updateAIPlayer();
    updateBall();

    drawQuote();
    drawSprites();
}

function drawQuote() {
    quote.draw();
}

function updateBall() {
    ball.bounceWith(quote.activeColliders);
    ball.handSpeed = map(player.handVelX, 0, 9, 5, 20);
    ball.update();
}

function updateAIPlayer() {
    aiPlayer.update(ball.pos());
}

function updatePlayer() {
    playerPos.set([100, mouseY]);
    player.update(playerPos, ball.pos());
}