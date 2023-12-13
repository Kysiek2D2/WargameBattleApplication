import GamePiece from "../pieces/GamePiece.js";

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

        this.unit;
    }

    init(data) {
        this.gameConfig = this.game.config;
        this.camera = this.cameras.main;
        this.mapWidthInGameDistanceUnits = data.mapWidthInGameDistanceUnits;
        this.mapHeightInGameDistanceUnits = data.mapHeightInGameDistanceUnits;
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

    loadMap(mapName) {
        console.log('Loading map...');
        var map = this.add.sprite(this.gameConfig.width / 2, this.gameConfig.height / 2, mapName);
        map.setOrigin(0.5, 0.5);
        map.setPosition(this.gameConfig.width / 2, this.gameConfig.height / 2);
        map.displayWidth = this.mapWidthInGameDistanceUnits * this.sceneDistanceUnitPixels;
        map.displayHeight = this.mapHeightInGameDistanceUnits * this.sceneDistanceUnitPixels;

        console.log(`Map size: \n width: ${map.width} px, \n height: ${map.height} px.`);
    }

    setListenerForCameraMovement() {
        this.input.on("pointermove", (pointer) => {
            if (!pointer.isDown || GamePiece.isMouseClickOnGamePiece(pointer, this)) return;
            this.camera.scrollX -= (pointer.x - pointer.prevPosition.x) / this.camera.zoom;
            this.camera.scrollY -= (pointer.y - pointer.prevPosition.y) / this.camera.zoom;
        });
    }

    zoomScene(cursorX, cursorY, zoomChange) {
        this.zoomLevel += zoomChange;
        this.camera.setZoom(this.zoomLevel);
        this.camera.centerOn(cursorX, cursorY);
        console.log(`handleZooming: \n zoomChange: ${zoomChange} \n zoomLevel: ${this.zoomLevel} \n center on X: ${cursorX} and Y: ${cursorY}`)
    }

    handleZooming() {
        console.log(`Cursor X: ${this.input.x} and Y: ${this.input.y}`)
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

    setListenerForPointerDown() { //This is not used, but might be useful as reference
        this.input.on('pointerdown', (pointer) => {
            if (GamePiece.isMouseClickOnGamePiece(pointer, this)) {
                console.log('Mouse click on unit!');
            } else {
                console.log('Mouse click OUTSIDE OF unit!');
            }
        }, this);
    }
}

export default WargameScene;