import Phaser from '../lib/phaser.js'

let gameOver
let gameStarted
let upButton
let restartButton
let gameOverBanner
let messageInitial
let player
let birdName
let framesMoveUp
let backgroundDay
let backgroundNight
let ground
let pipesGroup
let gapsGroup
let nextPipes
let currentPipe
let scoreboardGroup
let score

export default class game extends Phaser.Scene{
    constructor(){
        super('game');
    }
    
    preload(){
        this.load.image('background-day', './src/background-day.png')
        this.load.image('background-night', './src/background-night.png')
        this.load.spritesheet('ground', './src/ground-sprite.png', {
            frameWidth: 336,
            frameHeight: 112
        })

        this.load.image('pipe-green-top', './src/pipe-green-top.png')
        this.load.image('pipe-green-bottom', './src/pipe-green-bottom.png')
        this.load.image('pipe-red-top', './src/pipe-red-top.png')
        this.load.image('pipe-red-bottom', './src/pipe-red-bottom.png')

        this.load.image('messageInitial', './src/message-initial.png')
        
        this.load.image('gameOver', './src/gameover.png')
        this.load.image('restart', './src/restart-button.png')
        
        this.load.spritesheet('red', './src/bird-red-sprite.png', {
            frameWidth: 34,
        frameHeight: 24
    })
    this.load.spritesheet('blue', './src/bird-blue-sprite.png', {
        frameWidth: 34,
        frameHeight: 24
    })
    this.load.spritesheet('yellow', './src/bird-yellow-sprite.png', {
        frameWidth: 34,
        frameHeight: 24
    })

    this.load.image('number0', './src/number0.png')
    this.load.image('number1', './src/number1.png')
    this.load.image('number2', './src/number2.png')
    this.load.image('number3', './src/number3.png')
    this.load.image('number4', './src/number4.png')
    this.load.image('number5', './src/number5.png')
    this.load.image('number6', './src/number6.png')
    this.load.image('number7', './src/number7.png')
    this.load.image('number8', './src/number8.png')
    this.load.image('number9', './src/number9.png')
    }

    create(){
        backgroundDay = this.add.image(144, 256, 'background-day').setInteractive()
        backgroundDay.on('pointerdown', moveBird)
        backgroundNight = this.add.image(144, 256, 'background-night').setInteractive()
        backgroundNight.visible = false
        backgroundNight.on('pointerdown', moveBird)

        gapsGroup = this.physics.add.group()
        pipesGroup = this.physics.add.group()
        scoreboardGroup = this.physics.add.staticGroup()

        ground = this.physics.add.sprite(144, 458, 'ground')
        ground.setCollideWorldBounds(true)
        ground.setDepth(10)

        messageInitial = this.add.image(144, 156, 'messageInitial')
        messageInitial.setDepth(30)
        messageInitial.visible = false

        upButton = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)

        this.anims.create({
            key: 'moving-ground',
            frames: this.anims.generateFrameNumbers('ground', {
                start: 0,
                end: 2
            }),
            frameRate: 15,
            repeat: -1
        })
        this.anims.create({
            key: 'stop-ground',
            frames: [{
                key: 'ground',
                frame: 0
            }],
            frameRate: 20
        })

        this.anims.create({
            key: 'red-clap-wing',
            frames: this.anims.generateFrameNumbers('red', {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'red-stop',
            frames: [{
                key: 'red',
                frame: 1
            }],
            frameRate: 20
        })

        this.anims.create({
            key: 'blue-clap-wing',
            frames: this.anims.generateFrameNumbers('blue', {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'blue-stop',
            frames: [{
                key: 'blue',
                frame: 1
            }],
            frameRate: 20
        })

        this.anims.create({
            key: 'yellow-clap-wing',
            frames: this.anims.generateFrameNumbers('yellow', {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'yellow-stop',
            frames: [{
                key: 'yellow',
                frame: 1
            }],
            frameRate: 20
        })

        prepareGame(this)

        gameOverBanner = this.add.image(144, 206, 'gameOver')
        gameOverBanner.setDepth(20)
        gameOverBanner.visible = false

        restartButton = this.add.image(144, 300, 'restart').setInteractive()
        restartButton.on('pointerdown', restartGame, this)
        restartButton.setDepth(20)
        restartButton.visible = false
    }

    update(){
        if (gameOver || !gameStarted)
        return

        if (framesMoveUp > 0)
            framesMoveUp--
        else if (Phaser.Input.Keyboard.JustDown(upButton))
            moveBird()
        else {
            player.setVelocityY(120)

            if (player.angle < 90)
                player.angle += 1
        }

        pipesGroup.children.iterate(function (child) {
            if (child == undefined)
                return

            if (child.x < -50)
                child.destroy()
            else
                child.setVelocityX(-100)
        })

        gapsGroup.children.iterate(function (child) {
            child.body.setVelocityX(-100)
        })

        nextPipes++
        if (nextPipes === 130) {
            makePipes(this)
            nextPipes = 0
        }
    }
}

function hitBird(player) {
    this.physics.pause()

    gameOver = true
    gameStarted = false

    player.play(getAnimationBird(birdName).stop);
    ground.play('stop-ground')

    gameOverBanner.visible = true
    restartButton.visible = true
}

function updateScore(_, gap) {
    score++
    gap.destroy()
    
    if (score % 10 == 0) {
        backgroundDay.visible = !backgroundDay.visible
        backgroundNight.visible = !backgroundNight.visible

        if (currentPipe === {top: 'pipe-green-top', bottom: 'pipe-green-bottom'})
            currentPipe = {top: 'pipe-red-top', bottom: 'pipe-red-bottom'}
        else
            currentPipe = {top: 'pipe-green-top', bottom: 'pipe-green-bottom'}
    }
    
    updateScoreboard()
}

function makePipes(scene) {
    if (!gameStarted || gameOver) return

    const pipeTopY = Phaser.Math.Between(-120, 120)
    
    const gap = scene.add.line(288, pipeTopY + 210, 0, 0, 0, 98)
    gapsGroup.add(gap)
    gap.body.allowGravity = false
    gap.visible = false
    
    const pipeTop = pipesGroup.create(288, pipeTopY, currentPipe.top)
    pipeTop.body.allowGravity = false
    
    const pipeBottom = pipesGroup.create(288, pipeTopY + 420, currentPipe.bottom)
    pipeBottom.body.allowGravity = false
}

function moveBird() {
    if (gameOver)
    return
    
    if (!gameStarted)
        startGame(this)

        player.setVelocityY(-400)
    player.angle = -15
    framesMoveUp = 5
}

function getRandomBird() {
    switch (Phaser.Math.Between(0, 2)) {
        case 0:
            return 'bird-red'
        case 1:
            return 'bird-blue'
        case 2:
            default:
                return 'bird-yellow'
    }
}

function getAnimationBird(birdColor) {
    switch (birdColor) {
        case 'bird-red':
            return {clapWings: 'red-clap-wing', stop: 'red-stop'}
        case 'bird-blue':
            return {clapWings: 'blue-clap-wing', stop: 'blue-stop'}
            case 'bird-yellow':
                default:
                    return {clapWings: 'yellow-clap-wing', stop: 'yellow-stop'}
                }
}

function updateScoreboard() {
    scoreboardGroup.clear(true, true)

    const scoreAsString = score.toString()
    if (scoreAsString.length == 1)
    scoreboardGroup.create(144, 30, 'number' + score).setDepth(10)
    else {
        let initialPosition = 144 - ((score.toString().length * 25) / 2)
        
        for (let i = 0; i < scoreAsString.length; i++) {
            scoreboardGroup.create(initialPosition, 30, 'number' + scoreAsString[i]).setDepth(10)
            initialPosition += 25
        }
    }
}

function restartGame() {
    pipesGroup.clear(true, true)
    pipesGroup.clear(true, true)
    gapsGroup.clear(true, true)
    scoreboardGroup.clear(true, true)
    player.destroy()
    gameOverBanner.visible = false
    restartButton.visible = false
    
    const gameScene = this
    console.log(gameScene);
    prepareGame(gameScene)
    
    gameScene.physics.resume()
}

function prepareGame(scene) {
    framesMoveUp = 0
    nextPipes = 0
    currentPipe = {top: 'pipe-green-top', bottom: 'pipe-green-bottom'}
    score = 0
    gameOver = false
    backgroundDay.visible = true
    backgroundNight.visible = false
    messageInitial.visible = true

    birdName = getRandomBird()
    player = scene.physics.add.sprite(60, 265, birdName)
    player.setCollideWorldBounds(true)
    player.anims.play(getAnimationBird(birdName).clapWings, true)
    player.body.allowGravity = false

    scene.physics.add.collider(player, ground, hitBird, null, scene)
    scene.physics.add.collider(player, pipesGroup, hitBird, null, scene)
    
    scene.physics.add.overlap(player, gapsGroup, updateScore, null, scene)
    
    ground.anims.play('moving-ground', true)
}

function startGame(scene) {
    gameStarted = true
    messageInitial.visible = false

    const score0 = scoreboardGroup.create(144, 30, 'number0')
    score0.setDepth(20)
    
    makePipes(scene)
}