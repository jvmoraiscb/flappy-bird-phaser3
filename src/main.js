import Phaser from './lib/phaser.js'

import game from './scenes/game.js'

export default new Phaser.Game({
    type: Phaser.AUTO,
    width: 288,
    height: 512,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {
                y: 300
            },
            debug: true
        }
    },
    scene: [game, ]
})