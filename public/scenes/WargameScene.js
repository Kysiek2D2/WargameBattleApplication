import GamePiece from "../pieces/GamePiece.js";
import SidePanelScene from "./SidePanelScene.js";
import { CONSTANTS } from "../Constants.js";

class WargameScene extends Phaser.Scene {

    constructor(sceneName) {
        super(sceneName);
        this.gameConfig;

        this.camera;
        this.zoomLevel = 1; // Initial zoom level
        this.zoomStep = 0.1; // Amount to change zoom on each spacebar press
        this.zoomCooldown = 0; // Set up a cooldown for handling the wheel event
        this.zoomCooldownDuration = 200; // Adjust this value as needed

        this.mapWidthInGameDistanceUnits;
        this.mapHeightInGameDistanceUnits;
        this.sceneDistanceUnitPixels;
        this.sidePanelScene;
        this.map;
    }

    init(data) {
        this.gameConfig = this.game.config;
        this.camera = this.cameras.main;
        this.mapWidthInGameDistanceUnits = data.mapWidthInGameDistanceUnits;
        this.mapHeightInGameDistanceUnits = data.mapHeightInGameDistanceUnits;
    }

    preload() {
        this.load.image({ key: 'universalGrassBattleground', url: 'assets/maps/maps72x48/landOfWonders.jpg' });
        this.load.image({ key: 'wood', url: 'assets/scenery/wood.jpg' })
    }

    create() {
        console.log('WargameScene create...');
        this.setSidePanelScene();
        this.setCameraMovementListeners();
        this.sceneDistanceUnitPixels = this.calculatesceneDistanceUnitPixels();
        this.loadBackground('wood');
        this.loadMap('universalGrassBattleground');
    }

    update() {
        this.handleZooming();
    }

    calculatesceneDistanceUnitPixels() {
        var distanceUnitPixels;
        if (this.gameConfig.width < this.gameConfig.height) {
            distanceUnitPixels = this.gameConfig.width / this.mapWidthInGameDistanceUnits;
        } else {
            distanceUnitPixels = this.gameConfig.height / this.mapHeightInGameDistanceUnits;
        }
        console.log(`Single game distance unit = ${distanceUnitPixels} px.`);
        return distanceUnitPixels;
    }

    loadBackground(spriteKey) {
        var background;
        background = this.add.sprite(this.gameConfig.width / 2, this.gameConfig.height / 2, spriteKey);
        background.setOrigin(0.0, 0.0);
        background.setPosition(this.gameConfig.width / 2, this.gameConfig.height / 2);
        background.setScale(1, 1); // Create mirror reflection

        background = this.add.sprite(this.gameConfig.width / 2, this.gameConfig.height / 2, spriteKey);
        background.setOrigin(0.0, 0.0);
        background.setPosition(this.gameConfig.width / 2, this.gameConfig.height / 2);
        background.setScale(-1, 1); // Create mirror reflection

        background = this.add.sprite(this.gameConfig.width / 2, this.gameConfig.height / 2, spriteKey);
        background.setOrigin(1.0, 0.0);
        background.setPosition(this.gameConfig.width / 2, this.gameConfig.height / 2);
        background.setScale(1, -1); // Create mirror reflection

        background = this.add.sprite(this.gameConfig.width / 2, this.gameConfig.height / 2, spriteKey);
        background.setOrigin(1.0, 0.0);
        background.setPosition(this.gameConfig.width / 2, this.gameConfig.height / 2);
        background.setScale(-1, -1); // Create mirror reflection
    }

    loadMap(mapName) {
        console.log('Loading map...');
        this.map = this.add.sprite(this.gameConfig.width / 2, this.gameConfig.height / 2, mapName)
            .setOrigin(0.5, 0.5)
            .setPosition(this.gameConfig.width / 2, this.gameConfig.height / 2)
        this.map.displayWidth = this.mapWidthInGameDistanceUnits * this.sceneDistanceUnitPixels;
        this.map.displayHeight = this.mapHeightInGameDistanceUnits * this.sceneDistanceUnitPixels;
        console.log(`Canvas/GameConfig size: \n width: ${this.gameConfig.width}, \n height: ${this.gameConfig.height}`);
        console.log(`Map size: \n width: ${this.map.width} px, \n height: ${this.map.height} px.`);
    }


    setCameraMovementListeners() {
        console.log(`setListenerForCameraMovement`);
        this.input.on("pointermove", (pointer) => {
            if (!pointer.isDown || GamePiece.isMouseClickOnGamePiece(pointer, this) || this.sidePanelScene.isMouseClickOnSidePanel(pointer)) return;
            this.camera.scrollX -= (pointer.x - pointer.prevPosition.x) / this.camera.zoom;
            this.camera.scrollY -= (pointer.y - pointer.prevPosition.y) / this.camera.zoom;
        });

        this.input.on('pointerdown', (pointer) => {
            console.log(`***** setActivateAndDeactivateListener`);
            if (!GamePiece.isMouseClickOnGamePiece(pointer, this)
                && !this.getSidePanelScene().isMouseClickOnSidePanel(pointer)
                && !GamePiece.isMouseClickOnActiveGamePieceRotationNode(pointer)
                && GamePiece.activateGamePiece !== null) {
                console.log('Deactivating game piece...');
                GamePiece.deactivateGamePiece();
            }
        }, this);
    }

    zoomScene(cursorX, cursorY, zoomChange) {
        this.zoomLevel += zoomChange;
        this.camera.setZoom(this.zoomLevel);
        this.camera.centerOn(cursorX, cursorY);
        console.log(`handleZooming: \n zoomChange: ${zoomChange} \n zoomLevel: ${this.zoomLevel} \n center on X: ${cursorX} and Y: ${cursorY}`);
    }

    handleZooming() {
        //console.log(`Cursor X: ${this.input.x} and Y: ${this.input.y}`)
        if (this.zoomCooldown <= 0) {
            this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
                if (deltaY > 0) {
                    this.zoomScene(this.input.x, this.input.y, -this.zoomStep, this);
                } else if (deltaY < 0) {
                    this.zoomScene(this.input.x, this.input.y, this.zoomStep, this);
                }
            }, this);
            // Apply cooldown to prevent rapid zooming
            this.zoomCooldown = this.zoomCooldownDuration;
        } else {
            // Decrease the cooldown on each update
            this.zoomCooldown -= this.time.deltaMS;
        }
    }

    setSidePanelScene() {
        this.scene.add(CONSTANTS.SCENES.SIDE_PANEL_SCENE, SidePanelScene, true);
        this.sidePanelScene = this.scene.get(CONSTANTS.SCENES.SIDE_PANEL_SCENE);
    }

    getSidePanelScene() {
        return this.scene.get(CONSTANTS.SCENES.SIDE_PANEL_SCENE);
    }

    setSidePanelVisibility(isVisible) {
        if (this.sidePanelScene) {
            this.sidePanelScene.setVisible(isVisible);
        }
    }

    /* //UNUSED
    setListenerForPointerDown() { //This is not used, but might be useful as reference
        this.input.on('pointerdown', (pointer) => {
            if (GamePiece.isMouseClickOnGamePiece(pointer, this) && !this.sidePanelScene.isMouseClickOnSidePanel(pointer)) {
                console.log('Mouse click on unit!');
                //TODO: set SidePanelScene visibility = true, set activeGamePiece, 
                //pass parameters to SidePanelScene#updateSidePanelScene() (name, pieceStrengt, reference to GamePiece? ...)
            }
            //TODO: check GamePiece state and perform actions like rotation, move etc.
            else {
                //TODO: set SidePanelScene visibility = false, unset activeGamePiece...
                console.log('Mouse click OUTSIDE OF unit!');
            }
        }, this);
    }*/
}

export default WargameScene;