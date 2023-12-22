import { CONSTANTS } from "../Constants.js";

class ToolsScene extends Phaser.Scene {
    constructor() {
        console.log(`ToolsScene constructor...`);
        super({ key: CONSTANTS.SCENES.TOOLS_SCENE, active: true });
        this.sceneConfig = {
            widthPercentage: 10,
            heightPercentage: 30,
            isVisible: true,
        };
        this.sceneBackground;
        this.camera;
    }
    preload() {
        this.load.image({ key: 'toolsSceneBackground', url: 'assets/scenery/verticalRedBanner.png' })

    }

    init() {
        this.sceneBackground = 'toolsSceneBackground';
        this.setVisible(this.sceneConfig.isVisible);
        this.camera = this.cameras.main;
    }

    create() {
        this.adjustCamera();
        this.setTransparentSpaceholder(this.sceneHeight * 0.1);
        this.loadSceneBackground(this.sceneBackground);
    }

    //TODO: Move to generic class, it's also used in GamePieceDetailsScene
    adjustCamera() {
        // Adjust the camera to take only a portion of the screen
        const { width: gameConfigWidth, height: gameConfigHeight } = this.game.config;
        this.sceneWidth = (this.sceneConfig.widthPercentage / 100) * gameConfigWidth;
        this.sceneHeight = this.sceneConfig.heightPercentage / 100 * gameConfigHeight;
        console.log(`ToolsScene size: \n width: ${this.sceneWidth}, \n height: ${this.sceneHeight}`);
        this.camera.setViewport(0, 0, this.sceneWidth, gameConfigHeight);
        console.log(`ToolsScene camera x: ${this.camera.x}, y: ${this.camera.y}`);
    }

    //TODO: Move to generic class, it's also used in GamePieceDetailsScene
    setTransparentSpaceholder(height) {
        // Add a transparent sprite to take up space
        const transparentSprite = this.add.sprite(0, 0, null);
        transparentSprite.isVerticalSpaceholder = true;
        transparentSprite.setAlpha(0); // Set the alpha value to 0 for transparency
        transparentSprite.setSize(this.sceneWidth, height); // Adjust the size as needed
        this.panelLastOccupiedPixelOnYAxis += transparentSprite.height; //Lifting down GamePieceDetailsScene elements
    }

    //TODO: Move to generic class, it's also used in GamePieceDetailsScene
    loadSceneBackground(spriteKey) {
        const background = this.add.image(0, 0, spriteKey);
        background.setOrigin(0);
        background.setScale(this.sceneWidth / background.width, this.sceneHeight / background.height);
        background.setDepth(-1);
    }

    //TODO: Move to generic class, it's also used in GamePieceDetailsScene
    setVisible(isVisible) {
        this.sceneConfig.isVisible = isVisible;
        this.scene.setVisible(isVisible, this);
    }

}

export default ToolsScene;