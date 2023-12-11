var zoomLevel = 1; // Initial zoom level
var zoomStep = 0.1; // Amount to change zoom on each spacebar press
var mainCamera;

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

        console.log(`Size of canvas, WIDTH: ${gameConfig.width}, HEIGHT: ${gameConfig.height}`)
        const BATTLEGROUND_SCREEN_WIDTH_PRC = 0.8;
        const BATTLEGROUND_SCREEN_HEIGHT_PRC = 0.53;

        var battleground = this.add.sprite(config.width / 2, config.height / 2, 'universalGrassBattleground');
        battleground.setOrigin(0.5, 0.5);
        battleground.setPosition(config.width / 2, config.height / 2);
        battleground.width = config.width * BATTLEGROUND_SCREEN_WIDTH_PRC;
        battleground.height = config.height * BATTLEGROUND_SCREEN_HEIGHT_PRC;

        var unit = this.add.sprite(1100, 110, 'basicInfantryUnitSizeL')
            .setOrigin(0.5, 0.5)
            .setScale(0.1, 0.1)
            .setInteractive({ draggable: true });
        this.input.setDraggable(unit);
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

        //Set up main camera for zooming
        mainCamera = this.cameras.main;
    }



    update() {
        // Check cursor position for zooming
        var cursorX = this.input.x;
        var cursorY = this.input.y;
        console.log(`Cursor X: ${this.input.x} and Y: ${this.input.y}`)

        // Check if the cursor is inside the canvas boundaries
        // var isCursorInside = isCursorInsideCanvas(cursorX, cursorY);

        // Check if 'Z' or 'X' was pressed and perform zooming accordingly
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('Z'))) {
            // Cursor is inside canvas, handle zooming in
            handleZooming(cursorX, cursorY, zoomStep);
        }

        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('X'))) {
            // if (isCursorInside) {
            // Cursor is inside canvas, handle zooming out
            handleZooming(cursorX, cursorY, -zoomStep);
            // }
        }
    }
}


// function isCursorInsideCanvas(cursorX, cursorY) {
//     let check = (cursorX >= 0 && cursorX <= game.config.width) &&
//         (cursorY >= 0 && cursorY <= game.config.height)
//     console.log(`isCursorInsideCanvas: Is CURSOR inside CANVAS: ${check}. CursorX: ${cursorX}, CursorY: ${cursorY}, game.width: ${game.config.width}, game height: ${game.config.height}`)
//     return check;
// }

function handleZooming(cursorX, cursorY, zoomChange) {
    console.log('handleZooming()')
    zoomLevel += zoomChange;
    mainCamera.setZoom(zoomLevel);
    mainCamera.centerOn(cursorX, cursorY);
}

function zoomIn() {
    handleZooming(this, this.input.x, this.input.y, zoomStep);
}

function zoomOut() {
    handleZooming(this, this.input.x, this.input.y, -zoomStep);
}