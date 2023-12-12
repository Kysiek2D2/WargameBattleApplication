import UtilityMain from "../UtilityClasses/UtilityMain.js";

var zoomLevel = 1; // Initial zoom level
var zoomStep = 0.1; // Amount to change zoom on each spacebar press
var mainCamera;
var zoomCooldown;
var zoomCooldownDuration; // Adjust this value as needed
var cursorX;
var cursorY;

// Variables for camera movement
var isDragging = false;
var dragStartX;
var dragStartY;

var unit;
var isUnitSelected;

class FireAndSwordScene extends Phaser.Scene {

    constructor() {
        super("FireAndSwordScene");
    }

    preload() {
        this.load.image({ key: 'universalGrassBattleground', url: 'assets/battlegrounds72x48/universalGrass.jpg' });
        this.load.image({ key: 'basicInfantryUnitSizeL', url: 'assets/units/basic-infantry-size-L.png' });
    }

    create() {
        const gameConfig = this.game.config;
        UtilityMain.loadBattleground();
        console.log(`Canvas width: ${gameConfig.width}, height: ${gameConfig.height}`);

        const BATTLEGROUND_WIDTH_DISTANCE_UNITS = 72;
        const BATTLEGROUND_HEIGHT_DISTANCE_UNITS = 48;
        var SINGLE_DISTANCE_UNIT_IN_PIXELS = 100;

        if (gameConfig.width < gameConfig.height) {
            SINGLE_DISTANCE_UNIT_IN_PIXELS = gameConfig.width / BATTLEGROUND_WIDTH_DISTANCE_UNITS;
        } else {
            SINGLE_DISTANCE_UNIT_IN_PIXELS = gameConfig.height / BATTLEGROUND_HEIGHT_DISTANCE_UNITS;
        }

        var battleground = this.add.sprite(gameConfig.width / 2, gameConfig.height / 2, 'universalGrassBattleground');
        battleground.setOrigin(0.5, 0.5);
        battleground.setPosition(gameConfig.width / 2, gameConfig.height / 2);
        battleground.displayWidth = BATTLEGROUND_WIDTH_DISTANCE_UNITS * SINGLE_DISTANCE_UNIT_IN_PIXELS;
        battleground.displayHeight = BATTLEGROUND_HEIGHT_DISTANCE_UNITS * SINGLE_DISTANCE_UNIT_IN_PIXELS;

        console.log(`Size of battleground, WIDTH: ${battleground.width}, HEIGHT: ${battleground.height}`);


        isUnitSelected = false;

        //Set up main camera for zooming
        mainCamera = this.cameras.main;

        // Set up a cooldown for handling the wheel event
        this.zoomCooldown = 0;
        this.zoomCooldownDuration = 200; // Adjust this value as needed

        // Set up event listeners for camera movement
        this.input.on("pointermove", function (p) {
            if (!p.isDown || isMouseClickOnUnit(p)) return;
            mainCamera.scrollX -= (p.x - p.prevPosition.x) / mainCamera.zoom;
            mainCamera.scrollY -= (p.y - p.prevPosition.y) / mainCamera.zoom;
        });

        // Check for mouse click on 'unit'
        this.input.on('pointerdown', function (pointer) {
            if (isMouseClickOnUnit(pointer)) {
                console.log('Mouse click on unit!');
                isUnitSelected = true;
                // Add your logic for handling the click on the 'unit' here
            } else {
                console.log('Mouse click OUTSIDE OF unit!');
                isUnitSelected = false;
            }
        }, this);

        unit = this.add.sprite(1100, 110, 'basicInfantryUnitSizeL')
            .setOrigin(0.5, 0.5)
            .setInteractive({ draggable: true });
        unit.displayWidth = 6.3 * SINGLE_DISTANCE_UNIT_IN_PIXELS;
        unit.displayHeight = 2.5 * SINGLE_DISTANCE_UNIT_IN_PIXELS;
        this.input.setDraggable(unit);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })
    }

    update() {
        // Check cursor position for zooming
        cursorX = this.input.x;
        cursorY = this.input.y;
        console.log(`Cursor X: ${this.input.x} and Y: ${this.input.y}`)
        if (this.zoomCooldown <= 0) {
            this.input.on('wheel', function (pointer, gameObjects, deltaX, deltaY, deltaZ) {
                if (deltaY > 0) {
                    console.log(`Cursor 222 X: ${cursorX} and Y: ${cursorY}`)
                    handleZooming(cursorX, cursorY, -zoomStep);
                } else if (deltaY < 0) {
                    handleZooming(cursorX, cursorY, zoomStep);
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

function handleZooming(cursorX, cursorY, zoomChange) {
    console.log(`handleZooming: \n zoomChange: ${zoomChange} \n center on X: ${cursorX} and Y: ${cursorY}`)
    zoomLevel += zoomChange;
    mainCamera.setZoom(zoomLevel);
    mainCamera.centerOn(cursorX, cursorY);
}

function isMouseClickOnUnit(pointer) {
    // Convert screen coordinates to world coordinates
    var worldX = mainCamera.getWorldPoint(pointer.x, pointer.y).x;
    var worldY = mainCamera.getWorldPoint(pointer.x, pointer.y).y;
    // Check if the converted coordinates are within the bounds of the 'unit'
    var isMouseOnUnit = unit.getBounds().contains(worldX, worldY);
    console.log(`Is mouse click on unit: ${isMouseOnUnit}`);
    return isMouseOnUnit;
}

export default FireAndSwordScene;