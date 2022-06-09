import Phaser from '../lib/phaser.js'

let restartButton
let scoreboardGroup
let player

export default class gameOver extends Phaser.Scene{
    constructor(){
        super('game-over')
    }

    init(data){
        this.player = data.player
        this.dayOrNight = data.dayOrNight
        this.pipe1 = data.pipe1
        this.pipe2 = data.pipe2
        this.score = data.score
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

        this.load.image('gameOver', './src/resources/gameover.png')
        this.load.image('restart', './src/resources/restart-button.png')

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
        if(this.dayOrNight){
            this.add.image(144, 256, 'background-day')
        }
        else{
            this.add.image(144, 256, 'background-night')
        }

        if(this.pipe1){
            this.add.image(this.pipe1.top.x, this.pipe1.top.y, this.pipe1.top.texture.key)
            this.add.image(this.pipe1.bottom.x, this.pipe1.bottom.y, this.pipe1.bottom.texture.key)
        }

        if(this.pipe2){
            this.add.image(this.pipe2.top.x, this.pipe2.top.y, this.pipe2.top.texture.key)
            this.add.image(this.pipe2.bottom.x, this.pipe2.bottom.y, this.pipe2.bottom.texture.key)
        }

        this.add.sprite(144, 458, 'ground')

        player = this.add.sprite(this.player.x, this.player.y, this.player.texture.key)
        player.angle = this.player.angle

        this.add.image(144, 206, 'gameOver')

        restartButton = this.add.image(144, 300, 'restart').setInteractive()
        restartButton.on('pointerdown', () => this.scene.start('start'))

        scoreboardGroup = this.physics.add.staticGroup()
        updateScoreboard(this)
    }

    update(){}
}

function updateScoreboard(scene){
    scoreboardGroup.clear(true, true)

    const scoreAsString = scene.score.toString()

    if(scoreAsString.length == 1){
        scoreboardGroup.create(144, 30, 'number' + scene.score).setDepth(10)
    }
    else{
        let initialPosition = 144 - ((scene.score.toString().length *25) / 2)

        for(let i = 0; i < scoreAsString.length; i++){
            scoreboardGroup.create(initialPosition, 30, 'number' + scoreAsString[i]).setDepth(10)
            initialPosition += 25
        }
    }
}