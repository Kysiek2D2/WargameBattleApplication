import BasicMeasureTapePiece from "../pieces/BasicMeasureTapePiece.js";
import PoleAxeMeasureTapePiece from "../pieces/PoleAxeMeasureTapePiece.js";
import SidePanelScene from "./SidePanelScene.js";

class ToolsScene extends SidePanelScene {
    constructor() {
        console.log(`ToolsScene constructor...`);
        super({ widthPercentage: 5, heightPercentage: 30, isVisible: true });
        this.mainScene;
        this.elementsTintTimeoutInMs = 150;
    }

    preload() {
        super.preload({ backgroundUrl: 'assets/scenery/verticalRedBanner.png' });
    }

    init() {
        super.init();
    }

    create() {
        super.create();
        this.adjustCamera();
        this.loadSceneBackground(this.sceneBackground);
        this.setTransparentSpaceholder(this.sceneHeight * 0.15);
        this.addMeasureTapeIcon();
    }

    adjustCamera() {
        const { width: gameConfigWidth, height: gameConfigHeight } = this.game.config;
        this.sceneWidth = (this.sceneConfig.widthPercentage / 100) * gameConfigWidth;
        this.sceneHeight = this.sceneConfig.heightPercentage / 100 * gameConfigHeight;
        console.log(`ToolsScene size: \n width: ${this.sceneWidth}, \n height: ${this.sceneHeight}`);
        this.camera.setViewport(0, 0, this.sceneWidth, this.sceneHeight);
        console.log(`ToolsScene camera x: ${this.camera.x}, y: ${this.camera.y}`);
    }

    addMeasureTapeIcon() {
        const measureTapeIcon = this.add.image(0, 0, 'measureTape1.png');
        measureTapeIcon.setOrigin(0.5, 0);
        measureTapeIcon.setScale(0.03);
        measureTapeIcon.x = this.sceneWidth / 2;
        measureTapeIcon.y = this.panelLastOccupiedPixelOnYAxis;
        this.panelLastOccupiedPixelOnYAxis += measureTapeIcon.height;
        measureTapeIcon.setInteractive();
        measureTapeIcon.on('pointerdown', (pointer) => {
            measureTapeIcon.setTint(0x00ff00);
            setTimeout(() => {
                measureTapeIcon.clearTint();
            }, this.elementsTintTimeoutInMs);
            var measureTape = new PoleAxeMeasureTapePiece({ scene: this.mainScene, gamePieceName: 'tape', widthInDistanceUnits: 12, heightInDistanceUnits: 1, x: 100, y: 100, isFlipped: false });
        });
        return measureTapeIcon;
    }
}

export default ToolsScene;