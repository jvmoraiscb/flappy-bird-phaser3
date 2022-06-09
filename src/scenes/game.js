import Phaser from '../lib/phaser.js'

let upButton
let player
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
        super('game')
    }

    init(data){
        this.birdName = data.birdName
    }

    preload(){
        this.load.image('background-day', './src/resources/background-day.png')
        this.load.image('background-night', './src/resources/background-night.png')
        this.load.spritesheet('ground', './src/resources/ground-sprite.png', {
            frameWidth: 336,
            frameHeight: 112
        })

        this.load.image('pipe-green-top', './src/resources/pipe-green-top.png')
        this.load.image('pipe-green-bottom', './src/resources/pipe-green-bottom.png')
        this.load.image('pipe-red-top', './src/resources/pipe-red-top.png')
        this.load.image('pipe-red-bottom', './src/resources/pipe-red-bottom.png')
        
        this.load.spritesheet('bird-red', './src/resources/bird-red-sprite.png', {
            frameWidth: 34,
            frameHeight: 24
        })
        this.load.spritesheet('bird-blue', './src/resources/bird-blue-sprite.png', {
            frameWidth: 34,
            frameHeight: 24
        })
        this.load.spritesheet('bird-yellow', './src/resources/bird-yellow-sprite.png', {
            frameWidth: 34,
            frameHeight: 24
        })

        this.load.image('number0', './src/resources/number0.png')
        this.load.image('number1', './src/resources/number1.png')
        this.load.image('number2', './src/resources/number2.png')
        this.load.image('number3', './src/resources/number3.png')
        this.load.image('number4', './src/resources/number4.png')
        this.load.image('number5', './src/resources/number5.png')
        this.load.image('number6', './src/resources/number6.png')
        this.load.image('number7', './src/resources/number7.png')
        this.load.image('number8', './src/resources/number8.png')
        this.load.image('number9', './src/resources/number9.png')
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

        const score0 = scoreboardGroup.create(144, 30, 'number0')
        score0.setDepth(20)

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
            key: 'red-clap-wing',
            frames: this.anims.generateFrameNumbers('red', {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
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
            key: 'yellow-clap-wing',
            frames: this.anims.generateFrameNumbers('yellow', {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        })

        prepareGame(this)
    }

    update(){

        if(framesMoveUp > 0){
            framesMoveUp--
        }
        else if(Phaser.Input.Keyboard.JustDown(upButton)){
            moveBird()
        }
        else{
            player.setVelocityY(120)

            if(player.angle < 90){
                player.angle += 1
            }
        }

        pipesGroup.children.iterate(function(child){
            if(child == undefined){
                return
            }

            if(child.x < -50){
                child.destroy()
            }
            else{
                child.setVelocityX(-100)
            }
        })

        gapsGroup.children.iterate(function(child){
            child.body.setVelocityX(-100)
        })

        nextPipes++
        if(nextPipes === 130){
            makePipes(this)
            nextPipes = 0
        }
    }
}

function updateScore(_, gap){
    score++
    gap.destroy()
    if(score%10==0){
        if(backgroundDay.visible){
            backgroundDay.visible = false
            backgroundNight.visible = true
            currentPipe = {top: 'pipe-red-top', bottom: 'pipe-red-bottom'}
        }
        else{
            backgroundDay.visible = true
            backgroundNight.visible = false
            currentPipe = {top: 'pipe-green-top', bottom: 'pipe-green-bottom'}
        }
    }

    updateScoreboard()
}

function makePipes(scene){

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

function moveBird(){
    player.setVelocityY(-400)
    player.angle = -15
    framesMoveUp = 5
}

function getAnimationBird(birdColor){
    switch(birdColor){
        case 'bird-red':
            return 'red-clap-wing'
        case 'bird-blue':
            return 'blue-clap-wing'
        case 'bird-yellow':
            default:
                return 'yellow-clap-wing'
    }
}

function updateScoreboard(){
    scoreboardGroup.clear(true, true)

    const scoreAsString = score.toString()
    if(scoreAsString.length == 1){
        scoreboardGroup.create(144, 30, 'number' + score).setDepth(10)
    }
    else{
        let initialPosition = 144 - ((score.toString().length * 25) / 2)

        for( let i = 0; i < scoreAsString.length; i++){
            scoreboardGroup.create(initialPosition, 30, 'number' + scoreAsString[i]).setDepth(10)
            initialPosition += 25
        }
    }
}

function prepareGame(scene){
    framesMoveUp = 0
    nextPipes = 0
    currentPipe = {top: 'pipe-green-top', bottom: 'pipe-green-bottom'}
    score = 0
    backgroundDay.visible = true
    backgroundNight.visible = false

    player = scene.physics.add.sprite(60, 265, scene.birdName)
    player.setCollideWorldBounds(true)
    player.anims.play(getAnimationBird(scene.birdName), true)

    scene.physics.add.collider(player, ground, () => changeScene(scene), null, scene)
    scene.physics.add.collider(player, pipesGroup, () => changeScene(scene), null, scene)

    scene.physics.add.overlap(player, gapsGroup, updateScore, null, scene)

    ground.anims.play('moving-ground', true)
}

function changeScene(scene){
    let pipes = pipesGroup.getMatching('active', true)

    let data = {
        player: player,
        dayOrNight: false,
        pipe1: null,
        pipe2: null,
        score: score
    }

    if(backgroundDay.visible){
        data.dayOrNight = true
    }

    if(pipes[0]){
        data.pipe1 = {top: pipes[0], bottom: pipes[1]}
    }

    if(pipes[2]){
        data.pipe2 = {top: pipes[2], bottom: pipes[3]}
    }

    scene.scene.start('game-over', data)
}