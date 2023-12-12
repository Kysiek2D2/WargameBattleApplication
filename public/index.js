import FireAndSwordScene from "./scenes/FireAndSwordScene.js";
import MainMenu from "./scenes/MainMenu.js";

var config = {
    type: Phaser.AUTO,
    width: window.innerWidth * 0.95,
    height: window.innerHeight * 0.8,
    scene: [MainMenu, FireAndSwordScene],
    scale: {
        mode: Phaser.Scale.CENTER_BOTH,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    input: {
        mouse: true,
        touch: true
    },
    backgroundColor: '0xffffff'
};

var game = new Phaser.Game(config);