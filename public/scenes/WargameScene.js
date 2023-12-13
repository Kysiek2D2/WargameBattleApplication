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
        this.gameDistanceUnitPixels;

        this.cursorX;
        this.cursorY;

        this.unit;
    }

    init(data) {
        this.gameConfig = this.game.config;
        this.camera = this.cameras.main;
        this.mapWidthInGameDistanceUnits = data.mapWidthInGameDistanceUnits;
        this.mapHeightInGameDistanceUnits = data.mapHeightInGameDistanceUnits;
    }

    calculateGameDistanceUnitPixels() {
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
        map.displayWidth = this.mapWidthInGameDistanceUnits * this.gameDistanceUnitPixels;
        map.displayHeight = this.mapHeightInGameDistanceUnits * this.gameDistanceUnitPixels;

        console.log(`Map size: \n width: ${map.width} px, \n height: ${map.height} px.`);
    }

    setListenerForCameraMovement() {
        // Set up event listeners for camera movement
        this.input.on("pointermove", (pointer) => {
            if (!pointer.isDown || this.isMouseClickOnUnit(pointer, this.camera, this.unit)) return;
            this.camera.scrollX -= (pointer.x - pointer.prevPosition.x) / this.camera.zoom;
            this.camera.scrollY -= (pointer.y - pointer.prevPosition.y) / this.camera.zoom;
        });
    }

    handleZooming(cursorX, cursorY, zoomChange) {
        this.zoomLevel += zoomChange;
        this.camera.setZoom(this.zoomLevel);
        this.camera.centerOn(cursorX, cursorY);
        console.log(`handleZooming: \n zoomChange: ${zoomChange} \n zoomLevel: ${this.zoomLevel} \n center on X: ${cursorX} and Y: ${cursorY}`)
    }

    isMouseClickOnUnit(pointer) {
        // Convert screen coordinates to world coordinates
        var worldX = this.camera.getWorldPoint(pointer.x, pointer.y).x;
        var worldY = this.camera.getWorldPoint(pointer.x, pointer.y).y;
        // Check if the converted coordinates are within the bounds of the 'unit'
        var isMouseOnUnit = this.unit.getBounds().contains(worldX, worldY);
        console.log(`Is mouse click on unit: ${isMouseOnUnit}`);
        return isMouseOnUnit;
    }
}

export default WargameScene;