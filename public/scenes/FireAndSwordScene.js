import { loadMap, calculateGameDistanceUnitPixels } from "../UtilityClasses/UtilityMain.js";

class FireAndSwordScene extends Phaser.Scene {

    constructor() {
        super("FireAndSwordScene");
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

    preload() {
        this.load.image({ key: 'universalGrassBattleground', url: 'assets/maps/maps72x48/universalGrass.jpg' });
        this.load.image({ key: 'basicInfantryUnitSizeL', url: 'assets/units/basic-infantry-size-L.png' });
    }

    create() {
        console.log('FireAndSwordScene create...')
        this.gameDistanceUnitPixels = calculateGameDistanceUnitPixels(this);
        loadMap('universalGrassBattleground', this);

        // Set up event listeners for camera movement
        this.input.on("pointermove", (p) => {
            if (!p.isDown || isMouseClickOnUnit(p, this.camera, this.unit)) return;
            this.camera.scrollX -= (p.x - p.prevPosition.x) / this.camera.zoom;
            this.camera.scrollY -= (p.y - p.prevPosition.y) / this.camera.zoom;
        });

        // Check for mouse click on 'unit'
        this.input.on('pointerdown', (pointer) => {
            if (isMouseClickOnUnit(pointer, this.camera, this.unit)) {
                console.log('Mouse click on unit!');
                // Add your logic for handling the click on the 'unit' here
            } else {
                console.log('Mouse click OUTSIDE OF unit!');
            }
        }, this);

        this.unit = this.add.sprite(1100, 110, 'basicInfantryUnitSizeL')
            .setOrigin(0.5, 0.5)
            .setInteractive({ draggable: true });
        this.unit.displayWidth = 6.3 * this.gameDistanceUnitPixels;
        this.unit.displayHeight = 2.5 * this.gameDistanceUnitPixels;
        this.input.setDraggable(this.unit);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })
    }

    update() {
        // Check cursor position for zooming
        this.cursorX = this.input.x;
        this.cursorY = this.input.y;
        console.log(`Cursor X: ${this.input.x} and Y: ${this.input.y}`)
        if (this.zoomCooldown <= 0) {
            this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
                if (deltaY > 0) {
                    handleZooming(this.cursorX, this.cursorY, -this.zoomStep, this);
                } else if (deltaY < 0) {
                    handleZooming(this.cursorX, this.cursorY, this.zoomStep, this);
                }
            }, this);
            // Apply cooldown to prevent rapid zooming
            this.zoomCooldown = this.zoomCooldownDuration;
        } else {
            // Decrease the cooldown on each update
            this.zoomCooldown -= this.time.deltaMS;
        }
    }
}

function handleZooming(cursorX, cursorY, zoomChange, scene) {
    scene.zoomLevel += zoomChange;
    scene.camera.setZoom(scene.zoomLevel);
    scene.camera.centerOn(cursorX, cursorY);
    console.log(`handleZooming: \n zoomChange: ${zoomChange} \n zoomLevel: ${scene.zoomLevel} \n center on X: ${cursorX} and Y: ${cursorY}`)
}

function isMouseClickOnUnit(pointer, camera, unit) {
    // Convert screen coordinates to world coordinates
    var worldX = camera.getWorldPoint(pointer.x, pointer.y).x;
    var worldY = camera.getWorldPoint(pointer.x, pointer.y).y;
    // Check if the converted coordinates are within the bounds of the 'unit'
    var isMouseOnUnit = unit.getBounds().contains(worldX, worldY);
    console.log(`Is mouse click on unit: ${isMouseOnUnit}`);
    return isMouseOnUnit;
}

export default FireAndSwordScene;