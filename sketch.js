// canvas
var canvas;
var width;
var height;

// player
var playerPos;
var player;

// text
var quote;
var quoteDekart, quoteKant, quoteTest;

// images
var eyeImage, rectImage, handImg;
var chaosImages;

// sounds
var mute = false;
var soundPlayer;
var looseSound, winSound, pongHitSound, pongWallSound, music, wordHitSound;

// kant
var kantPlain, kantSad, kantHappy;
var kantSprite;

// dekart
var dekartPlain;

// AIPlayer 
var aiPlayer;
var chaosImage;

// ball
var ball, ballImage;
var wallTop, wallBottom;

// game manager
var gameManager;

function preload() {
    // text
    quoteDekart = loadStrings('Assets/text/quoteDekart1.txt');
    quoteKant = loadStrings('Assets/text/quoteKant1.txt');
    quoteTest = loadStrings('Assets/text/quoteTest.txt');
    // sounds
    music = loadSound('Assets/sounds/music.mp3');
    looseSound = loadSound('Assets/sounds/pLoose.mp3');
    winSound = loadSound('Assets/sounds/pWin.mp3');
    pongHitSound = loadSound('Assets/sounds/ballHit.mp3');
    pongWallSound = loadSound('Assets/sounds/ballTable.mp3');
    wordHitSound = loadSound('Assets/sounds/pong.wav');
    // images
    // load chaos images
    chaosImages = [];
    for (var i = 0; i < 9; i++) {
        var img1 = loadImage('Assets/images/chaos_' + (i + 1) + '.png');
        var img2 = loadImage('Assets/images/chaosBlink_' + (i + 1) + '.png');
        chaosImages[i] = [img1, img2];
    }
    rectImage = loadImage('Assets/images/rect_10px.png');
    handImg = loadImage('Assets/images/hand.png');
    eyeImage = loadImage('Assets/images/eye.png');
    kantPlain = loadImage('Assets/images/kant.png');
    kantSad = loadImage('Assets/images/kant_sad.png');
    kantHappy = loadImage('Assets/images/kant_happy.png');
    dekartPlain = loadImage('Assets/images/dekart.png');
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

    setupSounds();
    setupSoundPlayer();
    setupWalls();
    setupAIPlayer();
    setupPlayer();
    setupQuote();
    setupBall();
    setupGameManager();
    setupEvents();
}

function setupEvents() {
    quote.subscribe('solveQuote', gameManager.showLevelScreen);
    gameManager.subscribe('startGame', player.fadeIn);
    gameManager.subscribe('startGame', ball.reset);
    gameManager.subscribe('startGame', aiPlayer.enable);
    gameManager.subscribe('levelScreen', player.fadeOut);
    gameManager.subscribe('levelScreen', aiPlayer.disable);
    gameManager.subscribe('levelScreen', ball.disable);
    gameManager.subscribe('nextLevel', quote.nextQuote);
    gameManager.subscribe('nextLevel', player.nextPlayer);
    gameManager.subscribe('nextLevel', player.fadeIn);
    gameManager.subscribe('nextLevel', aiPlayer.enable);
    gameManager.subscribe('nextLevel', ball.reset);
    ball.subscribe('loose', player.onLoose);
    ball.subscribe('loose', quote.hideAllQuote);
    ball.subscribe('loose', soundPlayer.play['looseSound']);
    ball.subscribe('win', player.onWin);
    ball.subscribe('win', quote.revealWord);
    ball.subscribe('win', soundPlayer.play['winSound']);
    ball.subscribe('leftCollide', soundPlayer.play['pongHitSound']);
    ball.subscribe('leftCollide', quote.revealWord);
    ball.subscribe('rightCollide', soundPlayer.play['pongHitSound']);
    // ball.subscribe('rightCollide', quote.hideWord);
    ball.subscribe('wallCollide', soundPlayer.play['pongWallSound']);
    ball.subscribe('wordCollide', soundPlayer.play['wordHitSound']);
}

function setupGameManager() {
    gameManager = new GameManager();
    gameManager.showStartScreen();
}

function setupSounds() {
    if (!mute) {
        music.play();
        music.loop();
        music.playMode('restart');
    }
}

function setupQuote(argument) {
    quote = new Quote();
    quote.add({
        name: 'Dekart',
        strings: quoteKant,
        textSize: 40
    });
    quote.add({
        name: 'Kant',
        strings: quoteKant,
        textSize: 30
    });
    quote.createQuote();
}

function setupSoundPlayer() {
    soundPlayer = new SoundPlayer();
    // collect sounds in soundPlayer
    // soundPlayer.isMute = true;
    soundPlayer.add('looseSound', looseSound);
    soundPlayer.add('wordHitSound', wordHitSound);
    soundPlayer.add('winSound', winSound);
    soundPlayer.add('pongHitSound', pongHitSound);
    soundPlayer.add('pongWallSound', pongWallSound);
    // mute for testing 
}

function setupAIPlayer() {
    aiPlayer = new AIPlayer();
    aiPlayer.addImages(chaosImages);
}

function setupWalls() { // define walls here becuase we can have two balls but walls will be the same
    wallTop = createSprite(-30 / 2, height / 2, 30, height);
    wallTop.immovable = true; // should collide with ball
    wallBottom = createSprite(width + 30 / 2, height / 2, 30, height);
    wallBottom.immovable = true; // should collide with ball
}

function setupPlayer() {
    playerPos = new p5.Vector(100, 0);

    player = new Player();

    player.addCharacterData({
        name: 'Kant',
        faceNormal: kantPlain,
        faceWin: kantHappy,
        faceLose: kantSad,
        eyeImage: eyeImage,
        faceOffset: new p5.Vector(0, 30),
        eyeLPos: new p5.Vector(71, 54),
        eyeRPos: new p5.Vector(99, 54),
    });
    player.addCharacterData({
        name: 'Dekart',
        faceNormal: dekartPlain,
        faceWin: dekartPlain,
        faceLose: dekartPlain,
        eyeImage: eyeImage,
        faceOffset: new p5.Vector(0, 30),
        eyeLPos: new p5.Vector(83, 56),
        eyeRPos: new p5.Vector(113, 56),
    });

    player.addHand(handImg);
    player.setCharacter()
}

function setupBall() {
    // setup ball
    ball = new Ball(ballImage);
    // pass all collider to ball
    ball.wallTop = wallTop;
    ball.wallBottom = wallBottom;
    ball.paddleRight = aiPlayer.getPaddle(); // using getPaddle we can return any collided part of the player body (ex. hand or head )
    ball.paddleLeft = player.getPaddle();
}
// -------------
//     UPDATE
// -------------
function draw() {
    background(0, 0, 0);
    keyEvents();

    updatePlayer();
    updateAIPlayer();
    updateBall();

    drawSprites();
    drawQuote();
    drawBall();
    drawManager();

    TWEEN.update();
}
function keyEvents() {
    if (keyWentDown('a')) {
        player.fadeOut();
    }
    if (keyWentDown('s')) {
        player.nextPlayer();
        player.fadeIn();
    }
}

function drawManager() {
    gameManager.draw();
}

function drawBall() {
    ball.draw();
    drawSprite(ball.sprite);
}

function drawQuote() {
    quote.draw();
}

function updateBall() {
    ball.bounceWith(quote.activeColliders);
    ball.handSpeed = map(player.handVelX, 0, 9, 5, 10);
    ball.update(frameCount);
}

function updateAIPlayer() {
    aiPlayer.update(ball.pos());
}

function updatePlayer() {
    playerPos.set([100, mouseY]);
    player.update(playerPos, ball.pos());
}