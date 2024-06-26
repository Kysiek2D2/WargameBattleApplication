import GamePieceDetailsScene from "./GamePieceDetailsScene.js";
import ToolsScene from "./ToolsScene.js";
import { CONSTANTS } from "../Constants.js";
import GameController from "../UtilityClasses/GameController.js";
import RegimentPiece from "../pieces/RegimentPiece.js";
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
        this.gamePieceDetailsScene;
        this.toolsScene;
        this.map;
        this.gameController;
    }

    init(data) {
        this.gameConfig = this.game.config;
        this.camera = this.cameras.main;
        this.mapWidthInGameDistanceUnits = data.mapWidthInGameDistanceUnits;
        this.mapHeightInGameDistanceUnits = data.mapHeightInGameDistanceUnits;
        console.log('WargameScene init...');
    }

    async preload() {
        console.log('WargameScene preload...');
        /*at least one line of this.load.image is necessary to trigger Phaser3 loading sequence. 
        Otherwise fetchAssets won't work.*/
        this.load.image({ key: 'universalGrassBattleground', url: 'assets/maps/maps72x48/landOfWonders.jpg' });
        this.assets = await this.fetchAssets();
        console.log("Assets:" + this.assets);

        this.assets.forEach(asset => {
            this.load.image({ key: asset.name, url: asset.path });
        });
    }

    create() {
        this.load.start();
        console.log('WargameScene create...');
        //Order of invoking methods is important!
        this.setGamePieceDetailsScene();
        this.setToolsScene();
        this.loadBackground('wood.jpg');
        this.sceneDistanceUnitPixels = this.calculatesceneDistanceUnitPixels();
        this.loadMap('respring.jpg');
        this.gameController = new GameController(this);
        this.gameController.setMapPointerMoveListener(this.map);
        this.gameController.setMapPointerDownListener(this.map);
        //this.setCameraMovementListeners();
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
        background.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.BACKGROUND);

        background = this.add.sprite(this.gameConfig.width / 2, this.gameConfig.height / 2, spriteKey);
        background.setOrigin(0.0, 0.0);
        background.setPosition(this.gameConfig.width / 2, this.gameConfig.height / 2);
        background.setScale(-1, 1); // Create mirror reflection
        background.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.BACKGROUND);

        background = this.add.sprite(this.gameConfig.width / 2, this.gameConfig.height / 2, spriteKey);
        background.setOrigin(1.0, 0.0);
        background.setPosition(this.gameConfig.width / 2, this.gameConfig.height / 2);
        background.setScale(1, -1); // Create mirror reflection
        background.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.BACKGROUND);

        background = this.add.sprite(this.gameConfig.width / 2, this.gameConfig.height / 2, spriteKey);
        background.setOrigin(1.0, 0.0);
        background.setPosition(this.gameConfig.width / 2, this.gameConfig.height / 2);
        background.setScale(-1, -1); // Create mirror reflection
        background.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.BACKGROUND);
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
        this.map.setDepth(CONSTANTS.WARGAME_DEPTH_CATEGORIES.MAP);
        this.showHelpGrid(false); // Add this line to show the grid
    }

    setGamePieceDetailsScene() {
        this.scene.add(CONSTANTS.SCENES.GAME_PIECE_DETAILS_SCENE, GamePieceDetailsScene, true);
        this.gamePieceDetailsScene = this.scene.get(CONSTANTS.SCENES.GAME_PIECE_DETAILS_SCENE);
    }

    setToolsScene() {
        this.scene.add(CONSTANTS.SCENES.TOOLS_SCENE, ToolsScene, true);
        this.toolsScene = this.scene.get(CONSTANTS.SCENES.TOOLS_SCENE);
        this.toolsScene.mainScene = this;
    }

    getGamePieceDetailsScene() {
        return this.scene.get(CONSTANTS.SCENES.GAME_PIECE_DETAILS_SCENE);
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

    showHelpGrid(isVisible = false) {
        if (!isVisible) return;
        var grid = this.add.grid(this.map.getCenter().x, this.map.getCenter().y, this.map.displayWidth, this.map.displayHeight, this.sceneDistanceUnitPixels, this.sceneDistanceUnitPixels, 0x000000, 0.0, 0x000000, 0.5);
        grid.setOrigin(0.5, 0.5);
    }

    update() {
        this.handleZooming();
    }

    async fetchAssets() {
        console.log('Fetching assets...');
        try {
            const response = await fetch('http://localhost:3000/read-assets')
            const assets = await response.json();
            return assets;
        } catch (error) {
            console.error('Error fetching assets:', error);
            return {};
        }
    }
}

export default WargameScene;