import Phaser from './lib/phaser.js'

import start from './scenes/start.js'
import game from './scenes/game.js'
import gameOver from './scenes/game-over.js'

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
            debug: false
        }
    },
    scene: [start, game, gameOver]
})