
class FireAndSwordScene extends Phaser.Scene {

    constructor() {
        super("FireAndSwordScene");
    }

    preload() {
        this.load.image({ key: 'universalGrassBattleground', url: 'assets/battlegrounds72x48/universalGrass.jpg' });
        this.load.image({ key: 'basicInfantryUnitSizeL', url: 'assets/units/basic-infantry-size-L.png' });
    }

    create() {
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

        // Set up the camera
        this.camera = this.cameras.main;

        var zoomLevel = 1; // Initial zoom level
        var zoomStep = 0.1; // Amount to change zoom on each spacebar press

        // Listen for Z press
        this.input.keyboard.on('keydown-Z', function (event) {
            // Increase zoom level
            zoomLevel += zoomStep;
            // Set the new zoom level
            this.camera.setZoom(zoomLevel);
        }, this);


        // Listen for X press
        this.input.keyboard.on('keydown-X', function (event) {
            // Increase zoom level
            zoomLevel -= zoomStep;
            // Set the new zoom level
            this.camera.setZoom(zoomLevel);
        }, this);
    }
}



