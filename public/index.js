import FireAndSwordScene from "./scenes/FireAndSwordScene.js";
import MainMenuScene from "./scenes/MainMenuScene.js";
import GamePieceDetailsScene from "./scenes/GamePieceDetailsScene.js";

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth * 0.95,
    height: window.innerHeight * 0.90,
    scene: [MainMenuScene, FireAndSwordScene],
    scale: {
        mode: Phaser.Scale.CENTER_BOTH,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: {
        mouse: true,
        touch: true
    },
    backgroundColor: 0x000000
};

var game = new Phaser.Game(config);