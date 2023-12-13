import WargameScene from "./WargameScene.js";
import { someFunction } from "../UtilityClasses/UtilityMain.js";

class FireAndSwordScene extends WargameScene {

    constructor() {
        super("FireAndSwordScene");

    }

    preload() {
        this.load.image({ key: 'universalGrassBattleground', url: 'assets/maps/maps72x48/universalGrass.jpg' });
        this.load.image({ key: 'basicInfantryUnitSizeL', url: 'assets/units/basic-infantry-size-L.png' });
    }

    create() {
        console.log('FireAndSwordScene create...')
        this.gameDistanceUnitPixels = this.calculateGameDistanceUnitPixels();
        this.loadMap('universalGrassBattleground');
        this.setListenerForCameraMovement();


        // Check for mouse click on 'unit'
        this.input.on('pointerdown', (pointer) => {
            if (this.isMouseClickOnUnit(pointer, this.camera, this.unit)) {
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
                    this.handleZooming(this.cursorX, this.cursorY, -this.zoomStep, this);
                } else if (deltaY < 0) {
                    this.handleZooming(this.cursorX, this.cursorY, this.zoomStep, this);
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

export default FireAndSwordScene;