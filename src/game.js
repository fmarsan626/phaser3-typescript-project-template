"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("phaser");
var mainScene_1 = require("./scenes/mainScene");
/**
 * const config con los valores que se pasaran a Phaser.Game
 */
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [mainScene_1.default] //Escena a cargar
};
var game = new Phaser.Game(config);
