import { CONSTANTS } from "../Constants.js";

class MainMenuScene extends Phaser.Scene {

    constructor() {
        super(CONSTANTS.SCENES.MAIN_MENU_SCENE);
    }

    init() { }

    preload() { }

    create() {
        console.log(`MainMenuScene create...`);
        this.scene.start(CONSTANTS.SCENES.FIRE_AND_SWORD_SCENE, { mapWidthInGameDistanceUnits: 72, mapHeightInGameDistanceUnits: 48 });
    }

    update() { }
}

export default MainMenuScene;