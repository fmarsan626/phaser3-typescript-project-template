import 'phaser';
import MainScene from './scenes/mainScene';
/**
 * const config con los valores que se pasaran a Phaser.Game
 */
const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO, //Utiliza WebGL si es soportado, si no usa Canvas.
    width: 800,
    height: 600,
    physics: { //Puede ser arcade, impact o matter
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [MainScene]//Escena a cargar
};

const game = new Phaser.Game(config);