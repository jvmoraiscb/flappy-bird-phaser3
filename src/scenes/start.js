import Phaser from '../lib/phaser.js'

let backgroundDay
let messageInitial
let ground
let player
let birdName
let upButton

export default class start extends Phaser.Scene{
    constructor(){
        super('start')
    }

    preload(){
        this.load.image('background-day', './src/resources/background-day.png')
        this.load.spritesheet('ground', './src/resources/ground-sprite.png', {
            frameWidth: 336,
            frameHeight: 112
        })

        this.load.image('messageInitial', './src/resources/message-initial.png')
        
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
    }

    create(){
        backgroundDay = this.add.image(144, 256, 'background-day').setInteractive()
        backgroundDay.on('pointerdown', () => this.scene.start('game', {birdName: birdName}))

        ground = this.add.sprite(144, 458, 'ground')

        messageInitial = this.add.image(144, 156, 'messageInitial')
        messageInitial.setDepth(30)

        birdName = getRandomBird()
        player = this.add.sprite(60, 265, birdName)

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
            frames: this.anims.generateFrameNumbers('bird-red', {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'blue-clap-wing',
            frames: this.anims.generateFrameNumbers('bird-blue', {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'yellow-clap-wing',
            frames: this.anims.generateFrameNumbers('bird-yellow', {
                start: 0,
                end: 2
            }),
            frameRate: 10,
            repeat: -1
        })

        ground.anims.play('moving-ground', true)
        player.anims.play(getAnimationBird(birdName), true)
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(upButton)){
            this.scene.start('game', {birdName: birdName})
        }
    }
}

function getRandomBird(){
    switch(Phaser.Math.Between(0, 2)){
        case 0:
            return 'bird-red'
        case 1:
            return 'bird-blue'
        case 2:
            default:
            return 'bird-yellow'
    }
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